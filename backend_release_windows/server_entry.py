"""
Entry point for PyInstaller frozen executable.
Run directly for dev: python server_entry.py
"""

import multiprocessing
import os
import sys

# PyInstaller onefile extracts to a temp dir; tell uvicorn not to reload
os.environ.setdefault('OMP_NUM_THREADS', '1')
os.environ.setdefault('OPENBLAS_NUM_THREADS', '1')

# Fix spaCy model path when running as PyInstaller bundle
if getattr(sys, 'frozen', False):
    # Running as PyInstaller exe
    bundle_dir = sys._MEIPASS
    spacy_model_path = os.path.join(bundle_dir, 'en_core_web_sm')
    if os.path.exists(spacy_model_path):
        os.environ['SPACY_DATA'] = bundle_dir
        # Add to sys.path so spacy.load() can find it
        if bundle_dir not in sys.path:
            sys.path.insert(0, bundle_dir)
        print(f"[SACA] spaCy model path set: {spacy_model_path}")
    else:
        print(f"[SACA] WARNING: spaCy model not found at {spacy_model_path}")
        print(f"[SACA] Bundle contents: {os.listdir(bundle_dir)[:20]}")

if __name__ == '__main__':
    # Required for PyInstaller --onefile on Windows
    multiprocessing.freeze_support()

    import uvicorn
    from backend_release_windows.api.main import app

    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='warning', workers=1)
