"""
NLP Preprocessing Pipeline - SACA
Developer: Fathima Hamra Imam (105708480)

Cleans and normalises raw text input before symptom extraction.
Validated by Turner et al. (2022) for clinical free text - this
pipeline structure achieves 95-99% accuracy on clinical themes.

Input:  raw text string (from Whisper, Warlpiri translation, or user)
Output: dict with tokens list and clean_text string
"""

import re
import spacy

try:
    _nlp = spacy.load("en_core_web_sm")
except OSError:
    raise OSError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )


def preprocess_text(text: str) -> dict:
    """
    Cleans and preprocesses raw English text.

    Steps:
        1. Lowercase
        2. Remove noise (punctuation, numbers, special chars)
        3. Tokenise
        4. Remove stop words
        5. Lemmatise

    Args:
        text: Raw input string

    Returns:
        dict:
            tokens    - list of clean lemmatised tokens
            clean_text - space-joined string for Stage 2 TF-IDF
    """
    if not text or not text.strip():
        return {"tokens": [], "clean_text": ""}

    # Step 1: lowercase
    text = text.lower()

    # Step 2: remove noise - keep only letters and spaces
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    # Steps 3-5: tokenise, remove stopwords, lemmatise via spaCy
    doc = _nlp(text)
    tokens = [
        token.lemma_
        for token in doc
        if not token.is_stop
        and not token.is_punct
        and token.lemma_.strip()
        and len(token.lemma_) > 1
    ]

    return {
        "tokens": tokens,
        "clean_text": " ".join(tokens)
    }