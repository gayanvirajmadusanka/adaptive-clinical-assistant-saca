import sys

from backend.translation.warlpiri_text import translate

sys.path.append('backend')

tests = [
    "ngarru wiya",  # exact phrase
    "ngaju ngarru wiri",  # lexicon - I have headache pain
    "ngaju ngarru wiri wiya",  # lexicon + negation
    "kurdu karlarra",  # lexicon - child subject
    "ngaju ngarr wiri",  # fuzzy token - typo in ngarru
    "ngarru wiy",  # fuzzy phrase - typo
    "xyz abc",  # no match
]

for test in tests:
    result = translate(test)
    print(f"\nInput      : {test}")
    print(f"Translation: {result['translated_text']}")
    print(f"Confidence : {result['confidence']}")
    print(f"Match type : {result['match_type']}")
