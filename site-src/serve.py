# No-cache local preview of site/: http://127.0.0.1:4333/
import http.server, functools, os
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()
root = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'site')
http.server.ThreadingHTTPServer(('127.0.0.1', 4333), functools.partial(H, directory=root)).serve_forever()
