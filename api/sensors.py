from http.server import BaseHTTPRequestHandler
import json
import os
from urllib.parse import urlparse, parse_qs
from supabase import create_client

def get_supabase():
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    if not url or not key:
        return None
    return create_client(url, key)

class handler(BaseHTTPRequestHandler):
    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id')
        self.end_headers()
        return

    def do_GET(self):
        try:
            supabase = get_supabase()
            
            if not supabase:
                # Return mock data if Supabase is not configured
                mock_readings = [
                    {
                        "id": "1",
                        "sensor_id": "pH-001",
                        "sensor_type": "pH",
                        "value": 7.2,
                        "unit": "pH",
                        "timestamp": "2024-01-15T10:30:00Z"
                    },
                    {
                        "id": "2",
                        "sensor_id": "TEMP-001",
                        "sensor_type": "temperature",
                        "value": 24.5,
                        "unit": "C",
                        "timestamp": "2024-01-15T10:30:00Z"
                    },
                    {
                        "id": "3",
                        "sensor_id": "TURB-001",
                        "sensor_type": "turbidity",
                        "value": 0.8,
                        "unit": "NTU",
                        "timestamp": "2024-01-15T10:30:00Z"
                    }
                ]
                self.send_json(mock_readings)
                return

            # Parse query parameters
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            limit = int(params.get('limit', [100])[0])
            sensor_type = params.get('type', [None])[0]

            # Build query
            query = supabase.table('sensor_readings').select('*')
            
            if sensor_type:
                query = query.eq('sensor_type', sensor_type)
            
            response = query.order('timestamp', desc=True).limit(limit).execute()
            
            self.send_json(response.data)

        except Exception as e:
            self.send_json({"error": str(e)}, 500)
