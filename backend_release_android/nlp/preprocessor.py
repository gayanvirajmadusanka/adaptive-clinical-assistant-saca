import re

# Common English stop words (subset relevant to clinical text)
_STOP_WORDS = {
    "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they",
    "them", "his", "her", "its", "be", "is", "am", "are", "was", "were",
    "been", "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "shall", "can", "need",
    "a", "an", "the", "and", "but", "or", "if", "in", "on", "at", "to",
    "for", "of", "with", "by", "from", "up", "about", "as", "into",
    "that", "this", "these", "those", "so", "than", "then", "when",
    "what", "which", "who", "how", "not", "no", "nor", "very", "just",
    "also", "there", "here", "some", "any", "all", "both", "each",
    "few", "more", "most", "other", "own", "same", "such", "only",
    "over", "under", "again", "further", "still", "while", "get",
    "feel", "feeling", "felt", "having", "getting", "bit", "little",
    "lot", "really", "quite", "well", "bad", "good",
}


def preprocess_text(text: str) -> dict:
    if not text or not text.strip():
        return {"tokens": [], "clean_text": ""}

    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    tokens = [w for w in text.split() if w not in _STOP_WORDS and len(w) > 1]

    return {"tokens": tokens, "clean_text": " ".join(tokens)}
