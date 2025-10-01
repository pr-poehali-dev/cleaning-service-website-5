import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления услугами в админ-панели
    Args: event с httpMethod (GET/POST/PUT/DELETE), queryStringParameters, body
    Returns: HTTP response с данными услуг
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('SELECT id, title, description, icon, price FROM services ORDER BY id')
            rows = cur.fetchall()
            services = [
                {
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'icon': row[3],
                    'price': row[4]
                }
                for row in rows
            ]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(services)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            description = body_data.get('description')
            icon = body_data.get('icon', 'Building2')
            price = body_data.get('price')
            
            cur.execute(
                'INSERT INTO services (title, description, icon, price) VALUES (%s, %s, %s, %s) RETURNING id',
                (title, description, icon, price)
            )
            service_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'id': service_id, 'message': 'Service created'})
            }
        
        elif method == 'PUT':
            params = event.get('queryStringParameters', {})
            service_id = params.get('id')
            
            if not service_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing service id'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            description = body_data.get('description')
            icon = body_data.get('icon')
            price = body_data.get('price')
            
            cur.execute(
                'UPDATE services SET title = %s, description = %s, icon = %s, price = %s WHERE id = %s',
                (title, description, icon, price, service_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Service updated'})
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            service_id = params.get('id')
            
            if not service_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing service id'})
                }
            
            cur.execute('DELETE FROM services WHERE id = %s', (service_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Service deleted'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
