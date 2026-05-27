"""
SACA backend for Chaquopy Android integration.

No HTTP server — Java calls Python functions directly via Chaquopy JNI.
This avoids all Android socket/network-stack issues that prevented HTTP
responses from ever reaching OkHttp despite the server accepting connections.

Java calls:
    Python.getInstance().getModule("server").callAttr("start")
    Python.getInstance().getModule("server").callAttr("handle", path, bodyJson)
"""

import os
import json

os.environ['OMP_NUM_THREADS'] = '1'
os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['XGB_NTHREAD'] = '1'

_flask_app = None
_ready = False


def start():
    """
    Preloads all models and audio. Called from Java in a background thread.
    Blocks until fully ready, then returns. Java resolves its Promise.
    """
    global _flask_app, _ready
    if _ready:
        return

    print("[SACA] creating Flask app...", flush=True)
    from backend_release_android.api.flask_app import create_app
    _flask_app = create_app()
    print("[SACA] Flask app ready", flush=True)

    try:
        print("[SACA] preloading NLP model...", flush=True)
        from backend_release_android.nlp.symptom_extractor import _load_model
        _load_model()
        print("[SACA] NLP model ready", flush=True)
    except Exception as e:
        print(f"[SACA] NLP preload failed: {e}", flush=True)

    try:
        print("[SACA] warming audio cache...", flush=True)
        from backend_release_android.api.services.audio_service import preload_all_audio
        preload_all_audio()
        print("[SACA] audio cache ready", flush=True)
    except Exception as e:
        print(f"[SACA] audio preload failed: {e}", flush=True)

    _ready = True
    print("[SACA] backend ready", flush=True)


def handle(path: str, body_json: str) -> str:
    """
    Process one API request in-process using Flask's test client.
    No socket, no HTTP — direct WSGI call. Returns JSON response string.
    Called from Java for every API request.
    """
    if not _flask_app:
        return json.dumps({"error": "backend not initialized"})

    if path == '/health':
        return json.dumps({"status": "ok"})

    try:
        data = json.loads(body_json) if body_json else {}
        with _flask_app.test_client() as c:
            resp = c.post(path, json=data)
            return resp.get_data(as_text=True)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return json.dumps({"error": str(e)})
