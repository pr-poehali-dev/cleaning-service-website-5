'''
Business: Управление пользователями админ-панели (CRUD операции)
Args: event - dict с httpMethod, body, queryStringParameters, headers (X-User-Role для проверки прав)
      context - object с request_id
Returns: HTTP response dict с пользователями или результатом операции
'''

import json
import os
import hashlib
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    headers = event.get('headers', {})
    user_role = headers.get('X-User-Role', '')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Role, X-User-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cursor.execute('''
                SELECT id, full_name, phone, username, role, created_at, updated_at
                FROM t_p89410065_cleaning_service_web.users
                ORDER BY created_at DESC
            ''')
            users = cursor.fetchall()
            
            result = [{
                'id': row['id'],
                'full_name': row['full_name'],
                'phone': row['phone'],
                'login': row['username'],
                'role': row['role'],
                'created_at': row['created_at'].isoformat() if row['created_at'] else None,
                'updated_at': row['updated_at'].isoformat() if row['updated_at'] else None
            } for row in users]
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            if user_role != 'super_admin':
                return {
                    'statusCode': 403,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Доступ запрещён. Только главный администратор может добавлять пользователей.'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            full_name = body_data.get('full_name', '').strip()
            phone = body_data.get('phone', '').strip()
            role = body_data.get('role', '').strip()
            login = body_data.get('login', '').strip()
            password = body_data.get('password', '').strip()
            
            if not full_name or not phone or not role:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'ФИО, телефон и роль обязательны для заполнения'}),
                    'isBase64Encoded': False
                }
            
            if not login or not password:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Логин и пароль обязательны при создании пользователя'}),
                    'isBase64Encoded': False
                }
            
            if role not in ['super_admin', 'admin', 'manager', 'operator']:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Недопустимая роль'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hash_password(password)
            
            cursor.execute('''
                INSERT INTO t_p89410065_cleaning_service_web.users 
                (full_name, phone, username, password_hash, role)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, full_name, phone, username, role, created_at, updated_at
            ''', (full_name, phone, login, password_hash, role))
            
            new_user = cursor.fetchone()
            conn.commit()
            
            result = {
                'id': new_user['id'],
                'full_name': new_user['full_name'],
                'phone': new_user['phone'],
                'login': new_user['username'],
                'role': new_user['role'],
                'created_at': new_user['created_at'].isoformat() if new_user['created_at'] else None,
                'updated_at': new_user['updated_at'].isoformat() if new_user['updated_at'] else None
            }
            
            return {
                'statusCode': 201,
                'headers': cors_headers,
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        if method == 'PUT':
            if user_role != 'super_admin':
                return {
                    'statusCode': 403,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Доступ запрещён. Только главный администратор может изменять пользователей.'}),
                    'isBase64Encoded': False
                }
            
            params = event.get('queryStringParameters', {})
            user_id = params.get('id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'ID пользователя не указан'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            full_name = body_data.get('full_name', '').strip()
            phone = body_data.get('phone', '').strip()
            role = body_data.get('role', '').strip()
            login = body_data.get('login', '').strip()
            password = body_data.get('password', '').strip()
            
            if not full_name or not phone or not role:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'ФИО, телефон и роль обязательны для заполнения'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            update_values = []
            
            update_fields.extend(['full_name = %s', 'phone = %s', 'role = %s'])
            update_values.extend([full_name, phone, role])
            
            if login:
                update_fields.append('username = %s')
                update_values.append(login)
            
            if password:
                update_fields.append('password_hash = %s')
                update_values.append(hash_password(password))
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(user_id)
            
            query = f'''
                UPDATE t_p89410065_cleaning_service_web.users
                SET {', '.join(update_fields)}
                WHERE id = %s
                RETURNING id, full_name, phone, username, role, created_at, updated_at
            '''
            
            cursor.execute(query, update_values)
            
            updated_user = cursor.fetchone()
            
            if not updated_user:
                return {
                    'statusCode': 404,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            result = {
                'id': updated_user['id'],
                'full_name': updated_user['full_name'],
                'phone': updated_user['phone'],
                'login': updated_user['username'],
                'role': updated_user['role'],
                'created_at': updated_user['created_at'].isoformat() if updated_user['created_at'] else None,
                'updated_at': updated_user['updated_at'].isoformat() if updated_user['updated_at'] else None
            }
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            if user_role != 'super_admin':
                return {
                    'statusCode': 403,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Доступ запрещён. Только главный администратор может удалять пользователей.'}),
                    'isBase64Encoded': False
                }
            
            params = event.get('queryStringParameters', {})
            user_id = params.get('id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'ID пользователя не указан'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                'DELETE FROM t_p89410065_cleaning_service_web.users WHERE id = %s',
                (user_id,)
            )
            
            if cursor.rowcount == 0:
                return {
                    'statusCode': 404,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'message': 'Пользователь успешно удалён'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()