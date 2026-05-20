#!/usr/bin/env bash
# setup_release.sh — prepare backend_release_android for local testing and Android APK build.
#
# Usage:
#   ./setup_release.sh           # local dev: symlinks to backend/data and backend/models
#   ./setup_release.sh --android # APK build: copies required files, then runs MFCC precompute

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BR="$SCRIPT_DIR/backend_release_android"
BACKEND="$SCRIPT_DIR/backend"

echo "==> Setting up backend_release..."

if [[ "${1:-}" == "--android" ]]; then
  # ── Android build: copy files (Chaquopy needs real files, not symlinks) ─────
  echo "  Mode: Android (copy)"

  mkdir -p "$BR/data" "$BR/models"

  # copy only the data subdirectories the release backend actually uses
  for subdir in warlpiri audio frontend; do
    if [[ -d "$BACKEND/data/$subdir" ]]; then
      cp -r "$BACKEND/data/$subdir" "$BR/data/"
      echo "  Copied data/$subdir"
    fi
  done
  for file in questions.json symptom_vocabulary.json; do
    if [[ -f "$BACKEND/data/$file" ]]; then
      cp "$BACKEND/data/$file" "$BR/data/"
      echo "  Copied data/$file"
    fi
  done

  # copy only the required model files (not the full set of variants)
  for model in mlp.pkl tfidf_vectorizer.pkl label_encoder.pkl \
               nlp_symptom_classifier.pkl nlp_tfidf_vectorizer.pkl nlp_label_encoder.pkl; do
    if [[ -f "$BACKEND/models/$model" ]]; then
      cp "$BACKEND/models/$model" "$BR/models/"
      echo "  Copied models/$model"
    fi
  done

  # recompute Warlpiri keyword MFCCs using python_speech_features
  echo "  Recomputing keyword MFCCs with python_speech_features..."
  cd "$SCRIPT_DIR"
  python -m backend_release_android.nlp.precompute_mfcc_release
  echo "  MFCC recompute done"

  # copy server.py and backend_release_android to Android Python source directory
  ANDROID_PYTHON_DIR="$SCRIPT_DIR/mobile_app/android/app/src/main/python"
  if [[ -d "$ANDROID_PYTHON_DIR" ]]; then
    echo "  Syncing to $ANDROID_PYTHON_DIR..."
    cp "$SCRIPT_DIR/server.py" "$ANDROID_PYTHON_DIR/"
    cp -r "$BR" "$ANDROID_PYTHON_DIR/"
    echo "  Done"
  else
    echo "  WARNING: $ANDROID_PYTHON_DIR not found."
    echo "  Run 'cd mobile_app && npx expo prebuild --platform android' first."
  fi

else
  # ── Local dev: symlinks ──────────────────────────────────────────────────────
  echo "  Mode: local dev (symlinks)"

  if [[ -L "$BR/data" || -d "$BR/data" ]]; then
    rm -rf "$BR/data"
  fi
  if [[ -L "$BR/models" || -d "$BR/models" ]]; then
    rm -rf "$BR/models"
  fi

  ln -s "$BACKEND/data"   "$BR/data"
  ln -s "$BACKEND/models" "$BR/models"
  echo "  Symlinked backend/data   → backend_release/data"
  echo "  Symlinked backend/models → backend_release/models"

  # run MFCC precompute so keyword_mfcc_android.json exists for local testing
  echo "  Running MFCC precompute..."
  cd "$SCRIPT_DIR"
  python -m backend_release_android.nlp.precompute_mfcc_release || echo "  (MFCC precompute skipped — install python_speech_features first)"
fi

echo ""
echo "==> backend_release is ready."
echo ""
echo "Next steps:"
echo "  Local test : cd $SCRIPT_DIR && uvicorn backend_release.api.main:app --reload"
echo "  Android APK: cd mobile_app && npx expo prebuild --platform android"
echo "               then: ./setup_release.sh --android"
echo "               then: cd mobile_app/android && ./gradlew assembleRelease"
