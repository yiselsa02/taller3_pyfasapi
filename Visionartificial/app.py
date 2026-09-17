import cv2
from flask import Flask, render_template, Response


app = Flask(
    __name__,
    template_folder=".",
    static_folder=".",
    static_url_path=""
)


# =========================
# CARGAR CLASIFICADOR
# =========================

face_cascade = cv2.CascadeClassifier(
    "haarcascade_frontalface_default.xml"
)


# =========================
# ABRIR CÁMARA
# =========================

video_captura = cv2.VideoCapture(0)


# =========================
# DETECTAR ROSTROS
# =========================

def detect_bounding_box(vid):

    gray_img = cv2.cvtColor(
        vid,
        cv2.COLOR_BGR2GRAY
    )

    face = face_cascade.detectMultiScale(
        gray_img,
        1.1,
        5,
        minSize=(40, 40)
    )

    for (x, y, w, h) in face:

        cv2.rectangle(
            vid,
            (x, y),
            (x + w, y + h),
            (255, 0, 0),
            2
        )

    return face


# =========================
# GENERAR VIDEO
# =========================

def generate_frames():

    while True:

        result, video_frame = video_captura.read()

        if result is False:
            break


        # DETECCIÓN
        faces = detect_bounding_box(
            video_frame
        )


        # Mostrar cantidad de rostros
        cv2.putText(
            video_frame,
            f"Rostros: {len(faces)}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255, 0, 0),
            2
        )


        # Convertir frame a JPG
        ret, buffer = cv2.imencode(
            ".jpg",
            video_frame
        )

        if not ret:
            continue


        frame = buffer.tobytes()


        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame
            + b"\r\n"
        )


# =========================
# PÁGINA PRINCIPAL
# =========================

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# =========================
# VIDEO
# =========================

@app.route("/video_feed")
def video_feed():

    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )


# =========================
# EJECUTAR SERVIDOR
# =========================

if __name__ == "__main__":

    app.run(
        debug=True
    )