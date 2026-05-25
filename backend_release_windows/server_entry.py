"""
Entry point for PyInstaller frozen executable.
Run directly for dev: python server_entry.py
"""

import multiprocessing
import os
import sys
import subprocess

os.environ.setdefault('OMP_NUM_THREADS', '1')
os.environ.setdefault('OPENBLAS_NUM_THREADS', '1')

def ensure_spacy_model():
    try:
        import spacy
        spacy.load("en_core_web_sm")
        print("[SACA] spaCy model ready")
        return
    except OSError:
        pass

    print("[SACA] Downloading spaCy model, please wait...")
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install",
             "en-core-web-sm @ https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl"],
            check=True,
            capture_output=True
        )
        print("[SACA] spaCy model installed successfully")
    except Exception as e:
        print(f"[SACA] Failed to download spaCy model: {e}")
        raise OSError("spaCy model could not be installed. Please check your internet connection.")

if __name__ == '__main__':
    multiprocessing.freeze_support()
    ensure_spacy_model()

    import uvicorn
    from backend_release_windows.api.main import app

    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='warning', workers=1)
