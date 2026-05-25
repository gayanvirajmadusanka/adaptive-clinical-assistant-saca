import os
import pickle
import tempfile

with open('../models/stacking_mlp_et_xgb.pkl', 'rb') as f:
    model = pickle.load(f)

print(f'Model type: {type(model).__name__}')

# check total size
total = os.path.getsize('../models/stacking_mlp_et_xgb.pkl')
print(f'Total pickle: {total / 1024 / 1024:.1f} MB')

# check each component
if hasattr(model, 'estimators_'):
    for i, estimator in enumerate(model.estimators_):
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pkl') as tmp:
            pickle.dump(estimator, tmp)
            size = os.path.getsize(tmp.name)
            print(f'estimator[{i}] {type(estimator).__name__}: {size / 1024 / 1024:.1f} MB')

if hasattr(model, 'final_estimator_'):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pkl') as tmp:
        pickle.dump(model.final_estimator_, tmp)
        size = os.path.getsize(tmp.name)
        print(f'final_estimator {type(model.final_estimator_).__name__}: {size / 1024 / 1024:.1f} MB')

# also check tfidf
with open('../models/tfidf_vectorizer.pkl', 'rb') as f:
    tfidf = pickle.load(f)
with tempfile.NamedTemporaryFile(delete=False, suffix='.pkl') as tmp:
    pickle.dump(tfidf, tmp)
    print(f'tfidf: {os.path.getsize(tmp.name) / 1024 / 1024:.1f} MB')