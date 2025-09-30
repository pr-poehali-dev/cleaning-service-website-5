import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления заявками на уборку
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            path_params = event.get('pathParams', {})
            booking_id = path_params.get('id')
            
            if booking_id:
                cursor.execute(
                    "SELECT id, name, phone, email, address, area, service_type, comment, status, "
                    "TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created_at "
                    "FROM bookings WHERE id = " + str(int(booking_id))
                )
                booking = cursor.fetchone()
                if not booking:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Booking not found'}),
                        'isBase64Encoded': False
                    }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(booking)),
                    'isBase64Encoded': False
                }
            else:
                cursor.execute(
                    "SELECT id, name, phone, email, address, area, service_type, comment, status, "
                    "TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created_at "
                    "FROM bookings ORDER BY created_at DESC"
                )
                bookings = cursor.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(b) for b in bookings]),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name', '')
            phone = body_data.get('phone', '')
            email = body_data.get('email', '')
            address = body_data.get('address', '')
            area = body_data.get('area', 0)
            service_type = body_data.get('serviceType', '')
            comment = body_data.get('comment', '')
            
            cursor.execute(
                "INSERT INTO bookings (name, phone, email, address, area, service_type, comment, status) "
                "VALUES ('" + name.replace("'", "''") + "', '" + phone.replace("'", "''") + "', '" + 
                email.replace("'", "''") + "', '" + address.replace("'", "''") + "', " + str(int(area)) + 
                ", '" + service_type.replace("'", "''") + "', '" + comment.replace("'", "''") + "', 'new') "
                "RETURNING id"
            )
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': result['id'], 'message': 'Booking created successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            path_params = event.get('pathParams', {})
            booking_id = path_params.get('id')
            if not booking_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Booking ID is required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            status = body_data.get('status', '')
            
            cursor.execute(
                "UPDATE bookings SET status = '" + status.replace("'", "''") + 
                "', updated_at = CURRENT_TIMESTAMP WHERE id = " + str(int(booking_id))
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Booking updated successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            path_params = event.get('pathParams', {})
            booking_id = path_params.get('id')
            if not booking_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Booking ID is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("DELETE FROM bookings WHERE id = " + str(int(booking_id)))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Booking deleted successfully'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()