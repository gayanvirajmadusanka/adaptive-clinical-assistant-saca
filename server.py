"""
SACA Flask server startup for Chaquopy Android integration.
Placed at the Python source root so Chaquopy can call:
    Python.getInstance().getModule("server").callAttr("start")

Uses wsgiref.simple_server (stdlib, HTTP/1.0, no keep-alive) so it works
reliably in a background daemon thread on Android.

Werkzeug make_server defaulted to HTTP/1.1 with keep-alive — in single-threaded
mode the server thread blocks on the keep-alive socket after the first response,
preventing all subsequent connections from being processed.
wsgiref sends Connection: close after every response, so the thread is always
free to accept the next connection immediately.
"""

import os
import threading
import time

os.environ['OMP_NUM_THREADS'] = '1'
os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['XGB_NTHREAD'] = '1'

_started = False
_lock    = threading.Lock()


def start():
    """Start the Flask server on 127.0.0.1:8000 in a daemon thread."""
    global _started
    with _lock:
        if _started:
            return
        _started = True

    thread = threading.Thread(target=_run, daemon=True, name="saca-server")
    thread.start()
    time.sleep(1.0)
    print("[SACA] Server started on http://127.0.0.1:8000", flush=True)


def _preload_models():
    """Preload all slow resources so every handler is fast on first request."""
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


def _run():
    try:
        print("[SACA] importing Flask app...", flush=True)
        from backend_release_android.api.flask_app import create_app
        from wsgiref.simple_server import make_server as wsgi_make_server
        from wsgiref.simple_server import WSGIRequestHandler

        class _Handler(WSGIRequestHandler):
            def log_message(self, fmt, *args):
                print(f"[SACA-HTTP] {fmt % args}", flush=True)
            def log_error(self, fmt, *args):
                print(f"[SACA-HTTP-ERR] {fmt % args}", flush=True)

        print("[SACA] creating Flask app...", flush=True)
        app = create_app()

        print("[SACA] preloading before server starts...", flush=True)
        _preload_models()

        print("[SACA] binding to 127.0.0.1:8000...", flush=True)
        srv = wsgi_make_server('127.0.0.1', 8000, app, handler_class=_Handler)

        print("[SACA] Flask server listening on :8000", flush=True)
        srv.serve_forever()
    except BaseException as exc:
        import traceback
        print(f"[SACA] Server CRASHED: {type(exc).__name__}: {exc}", flush=True)
        traceback.print_exc()
