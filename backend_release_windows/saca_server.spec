# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for SACA Windows server executable.
# Run from project root: pyinstaller backend_release_windows/saca_server.spec

import os
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

# Spec file lives in backend_release_windows/ — resolve project root from here
_HERE    = os.path.dirname(os.path.abspath(SPEC))
_ROOT    = os.path.dirname(_HERE)

# Collect spaCy model data
spacy_data = collect_data_files('en_core_web_sm')

a = Analysis(
    [os.path.join(_HERE, 'server_entry.py')],
    pathex=[_ROOT],
    binaries=[],
    datas=[
        # Runtime data files — bundled alongside backend_release_windows/ in the exe
        (os.path.join(_ROOT, 'backend', 'data'),   'backend_release_windows/data'),
        (os.path.join(_ROOT, 'backend', 'models'), 'backend_release_windows/models'),
        # spaCy model
        *spacy_data,
    ],
    hiddenimports=[
        # uvicorn internals not auto-detected by PyInstaller
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
        # fastapi / starlette
        'starlette.routing',
        'starlette.middleware',
        # sklearn estimators used in pickled models
        'sklearn.neural_network',
        'sklearn.pipeline',
        'sklearn.preprocessing',
        'sklearn.ensemble',
        'sklearn.feature_extraction.text',
        # xgboost
        'xgboost',
        # whisper
        'whisper',
        'whisper.audio',
        'whisper.model',
        # rapidfuzz
        'rapidfuzz',
        # imbalanced-learn
        'imblearn',
    ],
    hookspath=[os.path.join(_HERE, 'hooks')],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        # dev / analysis only — not needed in the exe
        'matplotlib', 'seaborn', 'pandas', 'jupyter', 'notebook',
        'pytest', 'IPython', 'tkinter',
        # webrtcvad hook is broken in pyinstaller-hooks-contrib; exclude it.
        # audio_warlpiri.py uses lazy try/except import so absence is handled gracefully.
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
    console=True,       # keep console for log visibility; set False for silent background exe
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    onefile=True,
)
