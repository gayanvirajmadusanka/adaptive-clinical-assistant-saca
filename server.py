"""
SACA Flask server startup for Chaquopy Android integration.
Placed at the Python source root so Chaquopy can call:
    Python.getInstance().getModule("server").callAttr("start")

Uses Flask + Werkzeug make_server (blocking I/O, no asyncio) so it works
reliably in a background daemon thread on Android.

threaded=False: requests handled directly in the server thread, no per-request
thread spawning. Avoids JVM thread re-attachment overhead on Android/Chaquopy
which caused request threads to silently hang and never send responses.
All slow work (audio, models) is preloaded before serve_forever() starts.
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
        from werkzeug.serving import make_server

        print("[SACA] creating Flask app...", flush=True)
        app = create_app()

        print("[SACA] preloading before server starts...", flush=True)
        _preload_models()

        print("[SACA] binding to 127.0.0.1:8000...", flush=True)
        srv = make_server('127.0.0.1', 8000, app)

        print("[SACA] Flask server listening on :8000", flush=True)
        srv.serve_forever()
    except BaseException as exc:
        import traceback
        print(f"[SACA] Server CRASHED: {type(exc).__name__}: {exc}", flush=True)
        traceback.print_exc()
