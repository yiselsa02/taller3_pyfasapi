# Taller 3 - Modelos de Machine Learning

Proyecto desarrollado para la implementación y despliegue de modelos de **Machine Learning** utilizando Python y Streamlit.

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

Instalar las librerías necesarias:

```bash
pip install -r Modelos_ml/requirements.txt
```

### 4. Ejecutar el proyecto en local

Para ejecutar la aplicación de Streamlit:

```bash
streamlit run Modelos_ml/RandomForest/3.Predecir_enfermedad.py
```

La aplicación se abrirá en el navegador y estará disponible normalmente en:

```text
http://localhost:8501
```

## 🌐 Despliegue

El proyecto se encuentra desplegado en **Streamlit Cloud**.

👉 **Aplicación:**
https://yiselsa02-ta-modelos-mlrandomforest3-predecir-enfermedad-4v1xon.streamlit.app/

## 🛠️ Tecnologías utilizadas

* Python
* Streamlit
* Scikit-learn
* Joblib
* Pandas
* NumPy
* Random Forest

## 📁 Estructura principal

```text
taller3_pyfastapi/
│
├── Modelos_ml/
│   ├── requirements.txt
│   │
│   └── RandomForest/
│       ├── 3.Predecir_enfermedad.py
│       └── models/
│           └── modelo_random_forest_ampliado.pkl
│
└── README.md
```


