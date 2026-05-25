"""
Re-train the triage MLP predictor and save Android-compatible pickles.

Mirrors the exact preprocessing and training from backend/notebooks/ml_preprocess.ipynb
and ml_train.ipynb, but runs under scikit-learn 1.1.3 so the resulting pickles
can be loaded by Chaquopy's Python 3.8 environment on Android.

Output files (in backend/models/):
  mlp_android.pkl
  tfidf_vectorizer_android.pkl
  label_encoder_android.pkl

Usage:
  python -m venv /tmp/venv113
  /tmp/venv113/bin/pip install --quiet "numpy<2" scikit-learn==1.1.3 pandas "imbalanced-learn==0.10.1"
  /tmp/venv113/bin/python backend/scripts/retrain_ml_sklearn113.py
"""

import os
import pickle

import numpy as np
import pandas as pd
import scipy.sparse
from imblearn.over_sampling import SMOTE
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, MaxAbsScaler

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_CSV_PATH = os.path.join(_BASE_DIR, 'data', 'SYNAPSE.csv')
_OUT_DIR  = os.path.join(_BASE_DIR, 'models')

_GENDER_MAP   = {'Male': 0, 'Female': 1}
_DURATION_MAP = {'Less than 3 days': 0, 'Greater than 3 days': 1}
_AGE_MAP      = {
    'below 5 years': 0, '6-15 years': 1,
    '16-45 years': 2,   '16-60 years': 2,
    'above 45 years': 3, 'above 60 years': 4,
}
_SEVERITY_MAP = {'Mild': 0, 'Moderate': 1, 'Severe': 2}


def _clean_symptoms(s: str) -> str:
    return ' '.join(part.strip().lower() for part in s.split(','))


def main() -> None:
    import sklearn
    print(f'scikit-learn version: {sklearn.__version__}')

    if not os.path.exists(_CSV_PATH):
        raise FileNotFoundError(f'SYNAPSE.csv not found at {_CSV_PATH}')

    print('Loading SYNAPSE.csv ...')
    df = pd.read_csv(_CSV_PATH)
    df.columns = df.columns.str.strip().str.replace(' ', '_')
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].str.strip()

    df['symptoms_clean'] = df['Symptoms'].apply(_clean_symptoms)

    # TF-IDF (matches ml_preprocess.ipynb)
    print('Fitting TF-IDF ...')
    tfidf   = TfidfVectorizer(ngram_range=(1, 2), max_features=3000, min_df=5, sublinear_tf=True)
    X_tfidf = tfidf.fit_transform(df['symptoms_clean'])

    # Demographic + severity features (matches ml_preprocess.ipynb)
    gender_enc   = df['Gender'].map(_GENDER_MAP).fillna(0)
    duration_enc = df['Duration'].map(_DURATION_MAP).fillna(0)
    age_enc      = df['Age'].str.strip().map(_AGE_MAP).fillna(2)
    severity_enc = df['Severity'].map(_SEVERITY_MAP).fillna(1)

    demo     = scipy.sparse.csr_matrix(np.column_stack([gender_enc, duration_enc, age_enc]))
    sev_feat = scipy.sparse.csr_matrix(severity_enc.values.reshape(-1, 1))
    X        = scipy.sparse.hstack([X_tfidf, demo, sev_feat])

    # Target (matches ml_preprocess.ipynb)
    le = LabelEncoder()
    le.fit(['Doctor Consultation', 'OTC Drug'])
    y  = le.transform(df['Final_Recommendation'])

    # Same 70/10/20 split as ml_preprocess.ipynb
    X_tv, _, y_tv, _ = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    X_train, _, y_train, _ = train_test_split(X_tv, y_tv, test_size=0.125, random_state=42, stratify=y_tv)

    # SMOTE balance (matches ml_preprocess.ipynb)
    print('Applying SMOTE ...')
    X_bal, y_bal = SMOTE(random_state=42).fit_resample(X_train, y_train)
    print(f'  balanced training set: {len(y_bal):,} samples')

    # MLP pipeline (matches ml_train.ipynb get_mlp())
    print('Training MLP pipeline (~10 min on 2-core CI runner) ...')
    mlp = Pipeline([
        ('scaler', MaxAbsScaler()),
        ('mlp', MLPClassifier(
            hidden_layer_sizes=(256, 128, 64),
            batch_size=512,
            max_iter=300,
            early_stopping=True,
            n_iter_no_change=15,
            random_state=42,
        )),
    ])
    mlp.fit(X_bal, y_bal)
    print('  training done')

    # Save with protocol=2 for maximum backward compatibility
    os.makedirs(_OUT_DIR, exist_ok=True)
    out_mlp   = os.path.join(_OUT_DIR, 'mlp_android.pkl')
    out_tfidf = os.path.join(_OUT_DIR, 'tfidf_vectorizer_android.pkl')
    out_le    = os.path.join(_OUT_DIR, 'label_encoder_android.pkl')

    with open(out_mlp,   'wb') as f: pickle.dump(mlp,   f, protocol=2)
    with open(out_tfidf, 'wb') as f: pickle.dump(tfidf, f, protocol=2)
    with open(out_le,    'wb') as f: pickle.dump(le,    f, protocol=2)

    print(f'Saved: {out_mlp}')
    print(f'Saved: {out_tfidf}')
    print(f'Saved: {out_le}')


if __name__ == '__main__':
    main()
