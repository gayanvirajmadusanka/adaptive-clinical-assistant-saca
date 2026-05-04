"""
SACA FastAPI application entry point.
Thread environment variables are set before any ML library imports
to prevent resource contention during inference.
"""
import os
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['XGB_NTHREAD'] = '1'

from fastapi import FastAPI

from backend.api.routes.api_routes import router

app = FastAPI()
app.include_router(router)
