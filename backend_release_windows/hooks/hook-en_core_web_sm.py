from PyInstaller.utils.hooks import collect_data_files, collect_submodules
import os
import en_core_web_sm

datas = collect_data_files('en_core_web_sm')
hiddenimports = collect_submodules('en_core_web_sm')

# Add explicit model directory
model_dir = os.path.dirname(en_core_web_sm.__file__)
datas += [(model_dir, 'en_core_web_sm')]

print(f"hook-en_core_web_sm: collected {len(datas)} files from {model_dir}")
