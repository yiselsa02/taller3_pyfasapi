# Taller 3 - Modelos de Machine Learning

Proyecto desarrollado para la implementación, entrenamiento y despliegue de modelos de **Machine Learning** utilizando Python.

El proyecto incluye diferentes componentes relacionados con **carga de datos, modelos de Machine Learning, regresión lineal, Random Forest y visión artificial**, además de aplicaciones web y APIs para realizar predicciones.

---

## 🚀 Pasos para ejecutar el sistema

### 1. Clonar el repositorio

```bash
git clone https://github.com/yiselsa02/taller3_pyfastapi.git

cd taller3_pyfastapi
```

### 2. Crear el entorno virtual

En Windows:

```bash
python -m venv venv
```

Activar el entorno virtual:

```bash
venv\Scripts\activate
```

### 3. Instalar las dependencias

Para el proyecto de Machine Learning:

```bash
pip install -r Modelos_ml/RandomForest/requirements.txt
```

Para el backend de Regresión Lineal:

```bash
pip install -r Modelos_ml/RegresionLineal/back/requirements.txt
```

Para el frontend de Regresión Lineal:

```bash
pip install -r Modelos_ml/RegresionLineal/frontend/requirements.txt
```

---

# 🤖 Modelos de Machine Learning

## 🌳 Random Forest

El proyecto cuenta con un modelo de **Random Forest** utilizado para realizar predicciones relacionadas con enfermedades.

El proceso se encuentra dividido en tres etapas:

1. Creación del dataset.
2. Entrenamiento del modelo.
3. Predicción mediante una aplicación desarrollada con Streamlit.

Los archivos principales son:

```text
RandomForest/
├── 1.Crear_dataset.py
├── 2.Entrenar_modelo.py
├── 3.Predecir_enfermedad.py
├── data/
├── models/
└── requirements.txt
```

### Ejecutar la aplicación

```bash
streamlit run Modelos_ml/RandomForest/3.Predecir_enfermedad.py
```

La aplicación se abrirá normalmente en:

```text
http://localhost:8501
```

---

# 📈 Regresión Lineal

El proyecto también implementa un modelo de **Regresión Lineal** para realizar predicciones de precios de viviendas a partir del área de la propiedad.

El sistema está dividido en:

* **Backend:** API desarrollada con FastAPI.
* **Modelo:** modelo de regresión lineal entrenado y almacenado para realizar las predicciones.
* **Frontend:** aplicación desarrollada con Django.
* **Despliegue:** backend y frontend desplegados en Railway.

### Backend

El backend se encuentra en:

```text
Modelos_ml/
└── RegresionLineal/
    └── back/
        ├── models/
        ├── DockerFile
        ├── main.py
        ├── requirements.txt
        └── train.py
```

### Frontend

El frontend se encuentra en:

```text
Modelos_ml/
└── RegresionLineal/
    └── frontend/
        ├── frontend/
        ├── predictor/
        │   ├── migrations/
        │   ├── templates/
        │   ├── admin.py
        │   ├── apps.py
        │   ├── models.py
        │   ├── tests.py
        │   ├── urls.py
        │   ├── views.py
        │   └── __init__.py
        │
        ├── db.sqlite3
        ├── Dockerfile
        ├── manage.py
        └── requirements.txt
```

La predicción recibe como dato principal el área de la vivienda en metros cuadrados y utiliza el modelo de regresión lineal para obtener un precio estimado.

---

# 👁️ Visión Artificial

El proyecto también cuenta con un apartado destinado a **Visión Artificial**, ubicado en:

```text
Visionartificial/
```

Este componente contiene los ejercicios y desarrollos relacionados con procesamiento y análisis de imágenes.

---

# 📁 Estructura general del proyecto

```text
taller3_pyfastapi/
│
├── Carga_datos/
│
├── Modelos_ml/
│   │
│   ├── RandomForest/
│   │   ├── data/
│   │   ├── models/
│   │   ├── 1.Crear_dataset.py
│   │   ├── 2.Entrenar_modelo.py
│   │   ├── 3.Predecir_enfermedad.py
│   │   └── requirements.txt
│   │
│   └── RegresionLineal/
│       │
│       ├── back/
│       │   ├── models/
│       │   ├── DockerFile
│       │   ├── main.py
│       │   ├── requirements.txt
│       │   └── train.py
│       │
│       └── frontend/
│           ├── frontend/
│           ├── predictor/
│           │   ├── migrations/
│           │   ├── templates/
│           │   ├── admin.py
│           │   ├── apps.py
│           │   ├── models.py
│           │   ├── tests.py
│           │   ├── urls.py
│           │   ├── views.py
│           │   └── __init__.py
│           │
│           ├── db.sqlite3
│           ├── Dockerfile
│           ├── manage.py
│           └── requirements.txt
│
├── Visionartificial/
│
└── README.md
```

> `venv` y las carpetas `__pycache__` no se muestran en la estructura porque son archivos y directorios generados localmente y no forman parte de la estructura funcional del proyecto.

---

# 🛠️ Tecnologías utilizadas

* **Python**
* **Scikit-learn**
* **Pandas**
* **NumPy**
* **Joblib**
* **Streamlit**
* **FastAPI**
* **Django**
* **Uvicorn**
* **Gunicorn**
* **Docker**
* **Railway**
* **Streamlit Cloud**
* **Git**
* **GitHub**

---

# 🔄 Flujo del sistema

## Random Forest

```text
Usuario
   ↓
Aplicación Streamlit
   ↓
Datos de entrada
   ↓
Modelo Random Forest
   ↓
Predicción
   ↓
Resultado
```

## Regresión Lineal

```text
Usuario
   ↓
Frontend Django
   ↓
API FastAPI
   ↓
Modelo de Regresión Lineal
   ↓
Predicción del precio
   ↓
Resultado mostrado al usuario
```

---

# 🌐 Despliegue

## Streamlit Cloud

El proyecto se encuentra desplegado en **Streamlit Cloud**.

👉 **Aplicación:**

https://yiselsa02-ta-modelos-mlrandomforest3-predecir-enfermedad-4v1xon.streamlit.app/

## Railway

### Backend

https://backend-production-5f826.up.railway.app/

### Frontend

https://taller3pyfasapi-production.up.railway.app/

---

# 📚 API de Regresión Lineal

La API permite realizar predicciones mediante el endpoint:

```text
POST /predict
```

Ejemplo de entrada:

```json
{
    "area_m2": 82.5
}
```

La API procesa el área de la vivienda mediante el modelo de regresión lineal y devuelve el precio estimado.

---

# 📖 Swagger

La documentación interactiva de la API está disponible mediante Swagger:

https://backend-production-5f826.up.railway.app/docs

Desde Swagger es posible consultar y probar los endpoints disponibles de la API.

---

# 🔗 Enlaces del proyecto

**Repositorio de GitHub:**

https://github.com/yiselsa02/taller3_pyfastapi

**Aplicación Streamlit:**

https://yiselsa02-ta-modelos-mlrandomforest3-predecir-enfermedad-4v1xon.streamlit.app/

**Backend Railway:**

https://backend-production-5f826.up.railway.app/

**Frontend Railway:**

https://taller3pyfasapi-production.up.railway.app/

**Swagger:**

https://backend-production-5f826.up.railway.app/docs
