"""Serve only the cartography research assets and its locked browser dependencies."""
import argparse
import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent.parent
FILES = {
    "/cartography/index.html", "/cartography/raster.html", "/cartography/style.css",
    "/cartography/controls.mjs", "/cartography/main.mjs", "/cartography/model.mjs",
    "/cartography/providers.mjs", "/cartography/raster.mjs", "/prototype/model.mjs",
    "/prototype/node_modules/maplibre-gl/dist/maplibre-gl.css",
    "/prototype/node_modules/maplibre-gl/dist/maplibre-gl.mjs",
    "/prototype/node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
    "/prototype/node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs",
    "/prototype/node_modules/leaflet/dist/leaflet.css",
    "/prototype/node_modules/leaflet/dist/leaflet.js",
}


class ResearchHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = urlsplit(self.path).path
        if path == "/":
            self.send_response(302)
            self.send_header("Location", "/cartography/")
            self.end_headers()
            return None
        if path == "/cartography/":
            path = "/cartography/index.html"
        if path not in FILES or not (ROOT / path[1:]).is_file():
            self.send_error(404)
            return None
        self.path = path
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8767)
    args = parser.parse_args()
    mimetypes.add_type("text/javascript", ".mjs")
    with ThreadingHTTPServer((args.bind, args.port), lambda *params:
                             ResearchHandler(*params, directory=ROOT)) as server:
        print(f"Research map: http://{args.bind}:{args.port}/cartography/", flush=True)
        server.serve_forever()
