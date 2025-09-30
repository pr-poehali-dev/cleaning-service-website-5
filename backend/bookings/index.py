import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_notification_email(booking_data: Dict[str, Any]) -> None:
    '''Отправка email уведомления администратору о новой заявке'''
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = os.environ.get('SMTP_PORT', '587')
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    admin_email = os.environ.get('ADMIN_EMAIL')
    
    if not all([smtp_host, smtp_user, smtp_password, admin_email]):
        return
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка на уборку #{booking_data["id"]}'
    msg['From'] = smtp_user
    msg['To'] = admin_email
    
    html_content = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #00BCD4; border-bottom: 2px solid #00BCD4; padding-bottom: 10px;">
            Новая заявка на уборку
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Номер заявки:</strong> #{booking_data["id"]}</p>
            <p><strong>Клиент:</strong> {booking_data["name"]}</p>
            <p><strong>Телефон:</strong> {booking_data["phone"]}</p>
            <p><strong>Email:</strong> {booking_data["email"]}</p>
            <p><strong>Адрес:</strong> {booking_data["address"]}</p>
            <p><strong>Площадь:</strong> {booking_data["area"]} м²</p>
            <p><strong>Тип услуги:</strong> {booking_data["service_type"]}</p>
            {f'<p><strong>Желаемая дата:</strong> {booking_data["booking_date"]}</p>' if booking_data.get("booking_date") else ''}
            {f'<p><strong>Желаемое время:</strong> {booking_data["booking_time"]}</p>' if booking_data.get("booking_time") else ''}
            {f'<p><strong>Комментарий:</strong> {booking_data["comment"]}</p>' if booking_data.get("comment") else ''}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
            <p style="margin: 0;">⚠️ Не забудьте связаться с клиентом в ближайшее время!</p>
          </div>
        </div>
      </body>
    </html>
    '''
    
    msg.attach(MIMEText(html_content, 'html'))
    
    try:
        server = smtplib.SMTP(smtp_host, int(smtp_port))
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        pass

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
                    "TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created_at, "
                    "TO_CHAR(booking_date, 'YYYY-MM-DD') as booking_date, "
                    "TO_CHAR(booking_time, 'HH24:MI') as booking_time "
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
                    "TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created_at, "
                    "TO_CHAR(booking_date, 'YYYY-MM-DD') as booking_date, "
                    "TO_CHAR(booking_time, 'HH24:MI') as booking_time "
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
            
            name = body_data.get('name') or ''
            phone = body_data.get('phone') or ''
            email = body_data.get('email') or ''
            address = body_data.get('address') or ''
            area = body_data.get('area') or 0
            service_type = body_data.get('serviceType') or ''
            comment = body_data.get('comment') or ''
            booking_date = body_data.get('date') or ''
            booking_time = body_data.get('time') or ''
            
            if not all([name, phone, email, address, area, service_type, booking_date, booking_time]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'All required fields must be filled'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "INSERT INTO bookings (name, phone, email, address, area, service_type, comment, status, booking_date, booking_time) "
                "VALUES ('" + name.replace("'", "''") + "', '" + phone.replace("'", "''") + "', '" + 
                email.replace("'", "''") + "', '" + address.replace("'", "''") + "', " + str(int(area)) + 
                ", '" + service_type.replace("'", "''") + "', '" + comment.replace("'", "''") + "', 'new', '" + 
                booking_date.replace("'", "''") + "', '" + booking_time.replace("'", "''") + "') "
                "RETURNING id"
            )
            result = cursor.fetchone()
            conn.commit()
            
            booking_id = result['id']
            
            booking_notification_data = {
                'id': booking_id,
                'name': name,
                'phone': phone,
                'email': email,
                'address': address,
                'area': area,
                'service_type': service_type,
                'comment': comment,
                'booking_date': booking_date,
                'booking_time': booking_time
            }
            send_notification_email(booking_notification_data)
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': booking_id, 'message': 'Booking created successfully'}),
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