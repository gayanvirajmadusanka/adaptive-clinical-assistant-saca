# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for SACA Windows server executable.
# Run from project root: pyinstaller backend_release_windows/saca_server.spec

import os
import en_core_web_sm
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

_HERE = os.path.dirname(os.path.abspath(SPEC))
_ROOT = os.path.dirname(_HERE)

# Get spaCy model path explicitly
spacy_model_dir = os.path.dirname(en_core_web_sm.__file__)
print(f"[SACA] spaCy model path: {spacy_model_dir}")

# Collect all spaCy model data
spacy_data = collect_data_files('en_core_web_sm')
spacy_submodules = collect_submodules('en_core_web_sm')

print(f"[SACA] spaCy collected files: {len(spacy_data)}")

a = Analysis(
    [os.path.join(_HERE, 'server_entry.py')],
    pathex=[_ROOT],
    binaries=[],
    datas=[
        (os.path.join(_ROOT, 'backend', 'data'),   'backend_release_windows/data'),
        (os.path.join(_ROOT, 'backend', 'models'), 'backend_release_windows/models'),
        # spaCy model - explicit directory copy
        (spacy_model_dir, 'en_core_web_sm'),
        *spacy_data,
    ],
    hiddenimports=[
        'en_core_web_sm',
        *spacy_submodules,
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'starlette.routing',
        'starlette.middleware',
        'sklearn.neural_network',
        'sklearn.pipeline',
        'sklearn.preprocessing',
        'sklearn.ensemble',
        'sklearn.feature_extraction.text',
        'xgboost',
        'whisper',
        'whisper.audio',
        'whisper.model',
        'rapidfuzz',
        'imblearn',
    ],
    hookspath=[os.path.join(_HERE, 'hooks')],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'matplotlib', 'seaborn', 'pandas', 'jupyter', 'notebook',
        'pytest', 'IPython', 'tkinter',
        'webrtcvad',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='saca_server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    onefile=True,
)
