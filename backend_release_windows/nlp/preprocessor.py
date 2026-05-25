import re
import sys
import os
import spacy

def _load_spacy_model():
    # Try normal load first
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        pass

    # If frozen (PyInstaller), try loading from bundle directory
    if getattr(sys, 'frozen', False):
        bundle_dir = sys._MEIPASS
        model_path = os.path.join(bundle_dir, 'en_core_web_sm')
        if os.path.exists(model_path):
            try:
                return spacy.load(model_path)
            except Exception as e:
                print(f"[SACA] Failed to load spaCy from bundle path: {e}")

    raise OSError("spaCy model missing - run: python -m spacy download en_core_web_sm")


_nlp = _load_spacy_model()


def preprocess_text(text: str) -> dict:
    """
    Clean and normalise raw English text before symptom extraction.
    Applies lowercase, noise removal, tokenisation, stop word removal
    and lemmatisation using spaCy en_core_web_sm pipeline.
    :param text: raw input string
    :return: dict with tokens list and space-joined clean_text string
    """
    if not text or not text.strip():
        return {"tokens": [], "clean_text": ""}

    # lowercase and strip non-alpha characters
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
