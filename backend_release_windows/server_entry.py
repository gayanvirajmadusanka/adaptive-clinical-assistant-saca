"""
Entry point for PyInstaller frozen executable.
Run directly for dev: python server_entry.py
"""

import multiprocessing
import os
import sys

os.environ.setdefault('OMP_NUM_THREADS', '1')
os.environ.setdefault('OPENBLAS_NUM_THREADS', '1')

# Fix spaCy path before any imports
if getattr(sys, 'frozen', False):
    bundle_dir = sys._MEIPASS
    if bundle_dir not in sys.path:
        sys.path.insert(0, bundle_dir)

if __name__ == '__main__':
    multiprocessing.freeze_support()

    import uvicorn
    from backend_release_windows.api.main import app

    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='warning', workers=1)
