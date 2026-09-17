from flask import Flask, request, jsonify, send_from_directory
import cv2
import numpy as np
import base64
import os

app = Flask(__name__, static_folder="../public")


# ==========================================
# CONFIGURACIÓN DEL HAAR CASCADE
# ==========================================

CASCADE_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "haarcascade_frontalface_default.xml"
)

face_classifier = cv2.CascadeClassifier(CASCADE_PATH)


print("======================================")
print("VISION AI - DETECTOR DE ROSTROS")
print("======================================")
print("Ruta del Haar Cascade:")
print(os.path.abspath(CASCADE_PATH))


if face_classifier.empty():
    print("ERROR: NO SE PUDO CARGAR EL HAAR CASCADE")
else:
    print("OK: HAAR CASCADE CARGADO CORRECTAMENTE")


print("======================================")


# ==========================================
# PÁGINA PRINCIPAL
# ==========================================

@app.route("/")
def serve_index():
    return send_from_directory(
        app.static_folder,
        "index.html"
    )


# ==========================================
# ARCHIVOS ESTÁTICOS
# ==========================================

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(
        app.static_folder,
        path
    )


# ==========================================
# DETECCIÓN
# ==========================================

@app.route("/api/detect", methods=["POST"])
def detect_faces():

    print("\n======================================")
    print("NUEVA PETICIÓN DE DETECCIÓN")

    if "image" not in request.files:

        print("ERROR: No se recibió ninguna imagen")

        return jsonify({
            "success": False,
            "error": "No se proporcionó ninguna imagen"
        }), 400


    file = request.files["image"]

    print("Imagen recibida:", file.filename)


    try:

        # ----------------------------------
        # LEER IMAGEN
        # ----------------------------------

        filestr = file.read()

        print(
            "Tamaño recibido:",
            len(filestr),
            "bytes"
        )


        npimg = np.frombuffer(
            filestr,
            np.uint8
        )


        img = cv2.imdecode(
            npimg,
            cv2.IMREAD_COLOR
        )


        if img is None:

            print("ERROR: Imagen inválida")

            return jsonify({
                "success": False,
                "error": "Formato de imagen inválido"
            }), 400


        print(
            "Imagen cargada correctamente"
        )

        print(
            "Resolución:",
            img.shape
        )


        # ----------------------------------
        # ESCALA DE GRISES
        # ----------------------------------

        gray_image = cv2.cvtColor(
            img,
            cv2.COLOR_BGR2GRAY
        )

        gray_image = cv2.equalizeHist(
            gray_image
        )


        # ----------------------------------
        # DETECTAR CARAS
        # ----------------------------------

        faces = face_classifier.detectMultiScale(

            gray_image,

            scaleFactor=1.1,

            minNeighbors=5,

            minSize=(40, 40)
        )


        print(
            "CARAS DETECTADAS:",
            len(faces)
        )


        # ----------------------------------
        # DIBUJAR RESULTADOS
        # ----------------------------------

        output_img = img.copy()

        face_list = []


        for x, y, w, h in faces:

            x = int(x)
            y = int(y)
            w = int(w)
            h = int(h)


            face_list.append({

                "x": x,
                "y": y,
                "width": w,
                "height": h

            })


            # Cuadrado

            cv2.rectangle(

                output_img,

                (x, y),

                (x + w, y + h),

                (0, 255, 0),

                3

            )


            # Texto

            cv2.putText(

                output_img,

                "Rostro detectado",

                (x, max(y - 10, 20)),

                cv2.FONT_HERSHEY_SIMPLEX,

                0.65,

                (0, 255, 0),

                2

            )


        # ----------------------------------
        # CONVERTIR A JPEG
        # ----------------------------------

        success_encode, buffer = cv2.imencode(
            ".jpg",
            output_img,
            [
                cv2.IMWRITE_JPEG_QUALITY,
                85
            ]
        )


        if not success_encode:

            return jsonify({
                "success": False,
                "error": "No se pudo procesar la imagen"
            }), 500


        encoded_image = base64.b64encode(
            buffer
        ).decode("utf-8")


        # ----------------------------------
        # RESPUESTA
        # ----------------------------------

        print(
            "Imagen procesada correctamente"
        )

        print("======================================")


        return jsonify({

            "success": True,

            "faces_detected": len(face_list),

            "faces": face_list,

            "image":
                "data:image/jpeg;base64,"
                + encoded_image

        })


    except Exception as e:

        print(
            "ERROR:",
            str(e)
        )

        print("======================================")


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ==========================================
# SERVIDOR
# ==========================================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )