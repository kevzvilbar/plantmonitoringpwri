from http.server import BaseHTTPRequestHandler
import json
import os
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
                mock_plants = [
                    {
                        "id": "1",
                        "name": "Main Treatment Facility",
                        "location": "Building A",
                        "status": "online",
                        "created_at": "2024-01-01T00:00:00Z"
                    },
                    {
                        "id": "2",
                        "name": "Secondary Processing",
                        "location": "Building B",
                        "status": "online",
                        "created_at": "2024-01-01T00:00:00Z"
                    },
                    {
                        "id": "3",
                        "name": "Filtration Station",
                        "location": "Building C",
                        "status": "maintenance",
                        "created_at": "2024-01-01T00:00:00Z"
                    }
                ]
                self.send_json(mock_plants)
                return

            response = supabase.table('plants').select('*').execute()
            self.send_json(response.data)

        except Exception as e:
            self.send_json({"error": str(e)}, 500)
