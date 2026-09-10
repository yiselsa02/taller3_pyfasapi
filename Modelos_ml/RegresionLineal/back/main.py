import joblib
from pathlib import Path
from fastapi import FastAPI, HTTPException # pip install fastapi
from pydantic import BaseModel, Field # pip install pydantic

app = FastAPI(title="API de Prediccion de Precios de vivientes",
            description="Prediccion de precios de viviendas según su superficie", 
             version="1.0")

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models/linear_model.joblib"

try:
    # cargar el modelo entrenado
    model = joblib.load(MODEL_PATH)
except Exception:
    model = None

# Definir el esquema de entrada para la predicción
class housem2(BaseModel):
    area_m2: float = Field(..., example=82.5, description="Superficie de la vivienda en metros cuadrados")

@app.get("/")
def health_check():
    return {"status": "OK", "message": "Api de Prediccion de precios de viviendas esta en funcionamiento., ", "model_loaded": model is not None}

@app.post("/predict")
def predict_price(data: housem2):
    if not model:
        raise HTTPException(status_code=503, detail="Modelo no disponible. Por favor, intente mas tarde.")
    
    prediction = model.predict([[data.area_m2]])[0]

    return {
        "area_m2": data.area_m2,
        "predicted_price": round(float(prediction), 2)
    }