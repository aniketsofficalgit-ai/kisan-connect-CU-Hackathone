import os
from app import create_app
from config import config

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", config.PORT))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting Kisan Connect Flask Backend on http://{host}:{port} ...")
    app.run(host=host, port=port, debug=config.DEBUG)
