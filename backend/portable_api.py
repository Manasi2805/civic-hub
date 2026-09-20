import uvicorn
from pycloudflared import try_cloudflare
import threading
import time

try:
    from app.main import app
except ModuleNotFoundError:
    from fastapi import FastAPI
    app = FastAPI(title="Civic Hub API")
    @app.get("/")
    def root():
        return {"status": "online", "message": "Universal Civic Hub API active"}

def start_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

if __name__ == "__main__":
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    time.sleep(2)

    res = try_cloudflare(port=8000)
    public_url = getattr(res, 'tunnel', str(res))

    print("\n" + "=" * 60)
    print(" LIVE UNIVERSAL CIVIC HUB API:")
    print(f" -> Base URL: {public_url}")
    print(f" -> Swagger Docs: {public_url}/docs")
    print("=" * 60)
    print("Leave this terminal open. It will work globally anywhere!\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down.")