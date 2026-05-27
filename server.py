"""
SACA FastAPI server startup for Chaquopy Android integration.
Placed at the Python source root so Chaquopy can call:
    Python.getInstance().getModule("server").callAttr("start")
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
    """Start the FastAPI server on 127.0.0.1:8000 in a daemon thread."""
    global _started
    with _lock:
        if _started:
            return
        _started = True

    thread = threading.Thread(target=_run, daemon=True, name="saca-server")
    thread.start()
    # Give uvicorn a moment to bind the port before React Native makes its first call
    time.sleep(1.0)
    print("[SACA] Server started on http://127.0.0.1:8000")


def _preload_models():
    """Warm up slow imports in background so they're ready before first request."""
    try:
        print("[SACA] preloading NLP model...")
        from backend_release_android.nlp.symptom_extractor import _load_model
        _load_model()
        print("[SACA] NLP model ready")
    except Exception as e:
        print(f"[SACA] NLP preload failed (will retry on first request): {e}")


def _run():
    try:
        print("[SACA] importing uvicorn...")
        import uvicorn
        print("[SACA] importing app...")
        from backend_release_android.api.main import app
        print("[SACA] starting uvicorn on :8000")
        threading.Thread(target=_preload_models, daemon=True, name="saca-preload").start()
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
    except Exception as exc:
        print(f"[SACA] Server error: {exc}")
