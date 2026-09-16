import cv2
from flask import Flask, render_template, Response

app = Flask(
    __name__,
    template_folder=".",
    static_folder=".",
    static_url_path=""
)

# Cargar el clasificador Haar Cascade
face_cascade = cv2.CascadeClassifier(
    "haarcascade_frontalface_default.xml"
)

# Acceder a la cámara
video_captura = cv2.VideoCapture(0)


# Funcion para detectar rostro
def detect_bounding_box(vid):

    gray_img = cv2.cvtColor(vid, cv2.COLOR_BGR2GRAY)

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


# Generar los fotogramas
def generate_frames():

    while True:

        result, video_frame = video_captura.read()

        if result is False:
            break

        faces = detect_bounding_box(video_frame)

        ret, buffer = cv2.imencode(".jpg", video_frame)

        if not ret:
            continue

        frame = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame
            + b"\r\n"
        )


# Página principal
@app.route("/")
def index():

    return render_template("index.html")


# Cámara
@app.route("/video_feed")
def video_feed():

    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )


if __name__ == "__main__":

    app.run(debug=True)