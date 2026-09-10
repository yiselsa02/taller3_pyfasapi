import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import os


# Predecir precios de viviendas segun la superficie en m2

# Datos de entrenamiento (x) y etiquetas (y)

x = np.array([[40], [50], [60], [85], [100], [120]])
y = np.array([210000000, 300000000, 350000000, 500000000, 600000000, 700000000])

# Entrenar el modelo de regresion lineal

model = LinearRegression()
model.fit(x, y)

# # predicciones de prueba
# y_pred = model.predict(x)

# # imprimir la informacion del modelo entrenado
# print("Coeficiente de regresión:", model.coef_[0])
# print("Término independiente:", model.intercept_)

# # Graficar los datos reales
# plt.scatter(x, y, color='red', label='Datos de entrenamiento')

# # Graficar los datos de entrenamiento y la linea de regresion
# plt.plot(x, y_pred, color='green', label='Línea de regresión')

# plt.xlabel('Superficie (m2)')
# plt.ylabel('Precio (COP)')
# plt.title('Regresión Lineal: Precio de Viviendas según superficie(m2)')
# plt.legend()
# plt.grid(True)

# # imprimir grafica
# plt.show()

# Crear la carpeta donde se guardará el modelo
os.makedirs('Modelos_ml/RegresionLineal/models', exist_ok=True)

# Guardar el artefacto del modelo entrenado en un archivo
joblib.dump(model, 'Modelos_ml/RegresionLineal/models/linear_model.joblib')