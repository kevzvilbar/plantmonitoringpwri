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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id')
        self.end_headers()
        return

    def do_GET(self):
        try:
            supabase = get_supabase()
            
            if not supabase:
                # Return mock data if Supabase is not configured
                mock_alerts = [
                    {
                        "id": "1",
                        "type": "warning",
                        "message": "pH level approaching upper threshold",
                        "sensor_id": "pH-001",
                        "acknowledged": False,
                        "created_at": "2024-01-15T10:30:00Z"
                    },
                    {
                        "id": "2",
                        "type": "info",
                        "message": "Scheduled maintenance completed",
                        "sensor_id": None,
                        "acknowledged": True,
                        "created_at": "2024-01-15T09:00:00Z"
                    },
                    {
                        "id": "3",
                        "type": "critical",
                        "message": "Turbidity sensor offline",
                        "sensor_id": "TURB-003",
                        "acknowledged": False,
                        "created_at": "2024-01-15T08:15:00Z"
                    }
                ]
                self.send_json(mock_alerts)
                return

            # Parse query parameters
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            limit = int(params.get('limit', [50])[0])

            # Query Supabase
            response = supabase.table('alerts').select('*').order('created_at', desc=True).limit(limit).execute()
            
            self.send_json(response.data)

        except Exception as e:
            self.send_json({"error": str(e)}, 500)
