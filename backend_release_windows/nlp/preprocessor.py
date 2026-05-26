import re
import os
import sys
import spacy


def _load_spacy_model():
    # Try normal load first
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        pass

    # If frozen (PyInstaller), search for config.cfg recursively
    if getattr(sys, 'frozen', False):
        bundle_dir = sys._MEIPASS
        print(f"[SACA] Searching for spaCy model in: {bundle_dir}")

        # Try known paths first
        known_paths = [
            os.path.join(bundle_dir, 'en_core_web_sm', 'en_core_web_sm-3.7.1'),
            os.path.join(bundle_dir, 'en_core_web_sm-3.7.1'),
            os.path.join(bundle_dir, 'en_core_web_sm'),
        ]

        for path in known_paths:
            if os.path.exists(os.path.join(path, 'config.cfg')):
                try:
                    print(f"[SACA] Loading spaCy from: {path}")
                    return spacy.load(path)
                except Exception as e:
                    print(f"[SACA] Failed at {path}: {e}")

        # Last resort - walk entire bundle
        for root, dirs, files in os.walk(bundle_dir):
            if 'config.cfg' in files:
                try:
                    print(f"[SACA] Found config.cfg at: {root}")
                    return spacy.load(root)
                except Exception as e:
                    print(f"[SACA] Failed at {root}: {e}")
                    continue

    raise OSError("spaCy model missing - run: python -m spacy download en_core_web_sm")


_nlp = _load_spacy_model()


def preprocess_text(text: str) -> dict:
    if not text or not text.strip():
        return {"tokens": [], "clean_text": ""}

    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+",      " ", text).strip()

    doc    = _nlp(text)
    tokens = [
        token.lemma_
        for token in doc
        if not token.is_stop
           and not token.is_punct
           and token.lemma_.strip()
           and len(token.lemma_) > 1
    ]

    return {
        "tokens":     tokens,
        "clean_text": " ".join(tokens)
    }
