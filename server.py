from http.server import BaseHTTPRequestHandler, HTTPServer
from io import BytesIO

class ServeIndex(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)

        source = '.' + self.path
        if (self.path == "/"):
            source = "./index.html"

        binary = False

        if (source.endswith('.css')):
            self.send_header("Content-Type", "text/css")
        elif (source.endswith('.ttf')):
            self.send_header("Content-Type", "font/ttf")
            binary = True
        elif(source.endswith('.woff')):
            self.send_header("Content-Type", "font/woff2")
            binary = True
        elif(source.endswith('.html')):
            self.send_header("Content-Type", "text/html")
        elif(source.endswith('.js')):
            self.send_header("Content-Type", "text/javascript")
        else:
            self.send_header("Content-Type", "text/plain")

        self.end_headers()

        response = BytesIO()
        try:
            if (binary):
                with open(source, 'rb') as file:
                    response.write(file.read())
                    self.wfile.write(response.getvalue())
            else:
                with open(source, 'r', encoding="utf-8") as file:
                    content = file.read()
                    response.write(bytes(content, "utf-8"))
                    self.wfile.write(response.getvalue())
        except IOError:
            self.send_error(404,'File Not Found: %s' % source)

if __name__ == "__main__":        
    webServer = HTTPServer(("localhost", 8002), ServeIndex)
    print("Starting webserver on port 8002")

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

        webServer.server_close()
