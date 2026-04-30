"""
Symptom Vocabulary Builder - SACA
Developer: Fathima Hamra Imam (105708480)

Reads the Synapse dataset and extracts all unique symptom terms
into a JSON vocabulary file used by the symptom extractor.

This ensures vocabulary alignment between NLP extraction and
ML triage - both components work from the same clinical symptom set.

Run once before starting the server:
    python -m backend.nlp.build_vocabulary

Input:  backend/data/synapse.csv
Output: backend/data/symptom_vocabulary.json
"""

import os
import json
import pandas as pd
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH  = os.path.join(BASE_DIR, "data", "synapse.csv")
OUT_PATH  = os.path.join(BASE_DIR, "data", "symptom_vocabulary.json")


def clean_symptom(symptom: str) -> str:
    """
    Cleans a raw symptom string from the dataset.
    Lowercases, strips whitespace, removes extra characters.
    """
    symptom = symptom.lower().strip()
    symptom = re.sub(r"[^a-z\s]", " ", symptom)
    symptom = re.sub(r"\s+", " ", symptom).strip()
    return symptom


def build_vocabulary():
    """
    Reads synapse.csv Symptoms column, splits comma-separated
    symptom lists, cleans each term, deduplicates, and saves
    sorted vocabulary to JSON.
    """
    if not os.path.exists(CSV_PATH):
        print(f"ERROR: synapse.csv not found at {CSV_PATH}")
        return

    print("Reading synapse.csv...")
    df = pd.read_csv(CSV_PATH)

    if "Symptoms" not in df.columns:
        print("ERROR: Symptoms column not found in synapse.csv")
        return

    print(f"Processing {len(df)} rows...")

    all_symptoms = set()
    for raw in df["Symptoms"].dropna():
        parts = raw.split(",")
        for part in parts:
            cleaned = clean_symptom(part)
            if cleaned and len(cleaned) > 2:
                all_symptoms.add(cleaned)

    vocabulary = sorted(list(all_symptoms))

    with open(OUT_PATH, "w") as f:
        json.dump(vocabulary, f, indent=2)

    print(f"Done. {len(vocabulary)} unique symptoms saved to {OUT_PATH}")
    return vocabulary


if __name__ == "__main__":
    build_vocabulary()