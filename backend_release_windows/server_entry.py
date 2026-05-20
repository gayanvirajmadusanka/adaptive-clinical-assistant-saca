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

if __name__ == '__main__':
    # Required for PyInstaller --onefile on Windows
    multiprocessing.freeze_support()

    import uvicorn
    from backend_release_windows.api.main import app

    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='warning', workers=1)
