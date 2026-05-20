from PyInstaller.utils.hooks import collect_dynamic_libs

# The default hook-webrtcvad.py in pyinstaller-hooks-contrib is broken.
# webrtcvad is a simple C extension — collecting its shared lib is sufficient.
binaries = collect_dynamic_libs('webrtcvad')
hiddenimports = []
