const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const iniciar = document.getElementById("iniciar");
const detener = document.getElementById("detener");

const estado = document.getElementById("estado");
const rostros = document.getElementById("rostros");
const cameraMessage = document.getElementById("camera-message");

let stream = null;
let faceCascade = null;
let cascadeLoaded = false;
let opencvReady = false;

let detectorActivo = false;
let ultimoAnalisis = 0;

const INTERVALO_DETECCION = 150;


/* =========================
   ESPERAR A OPENCV
========================= */

function esperarOpenCV() {

    if (
        typeof cv !== "undefined" &&
        cv.Mat &&
        cv.CascadeClassifier
    ) {

        opencvReady = true;

        console.log("OpenCV listo");

        estado.textContent = "Detector listo";

    } else {

        setTimeout(
            esperarOpenCV,
            200
        );

    }
}

esperarOpenCV();


/* =========================
   CARGAR XML
========================= */

async function cargarCascade() {

    if (cascadeLoaded) {
        return;
    }

    estado.textContent =
        "Cargando detector...";


    const response = await fetch(
        "haarcascade_frontalface_default.xml"
    );


    if (!response.ok) {

        throw new Error(
            "No se encontró el archivo XML"
        );

    }


    const data =
        await response.arrayBuffer();


    const dataArray =
        new Uint8Array(data);


    cv.FS_createDataFile(
        "/",
        "haarcascade_frontalface_default.xml",
        dataArray,
        true,
        false,
        false
    );


    faceCascade =
        new cv.CascadeClassifier();


    faceCascade.load(
        "haarcascade_frontalface_default.xml"
    );


    cascadeLoaded = true;

    console.log(
        "Haar Cascade listo"
    );

}


/* =========================
   INICIAR
========================= */

iniciar.addEventListener(
    "click",
    async () => {

        try {

            console.log(
                "Botón iniciar presionado"
            );


            if (!opencvReady) {

                estado.textContent =
                    "OpenCV todavía está cargando";

                alert(
                    "Espera unos segundos a que cargue OpenCV y vuelve a presionar Iniciar."
                );

                return;

            }


            if (stream) {
                return;
            }


            estado.textContent =
                "Solicitando cámara...";


            stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        width: {
                            ideal: 640
                        },

                        height: {
                            ideal: 480
                        }
                    },

                    audio: false

                });


            console.log(
                "Cámara obtenida"
            );


            video.srcObject =
                stream;


            await new Promise(
                resolve => {

                    video.onloadedmetadata =
                        resolve;

                }
            );


            await video.play();


            console.log(
                "Video iniciado"
            );


            canvas.width =
                video.videoWidth || 640;

            canvas.height =
                video.videoHeight || 480;


            await cargarCascade();


            detectorActivo = true;


            cameraMessage.style.display =
                "none";


            estado.textContent =
                "Cámara activa";


            iniciar.disabled =
                true;

            detener.disabled =
                false;


            detectar();


        } catch (error) {

            console.error(
                "ERROR:",
                error
            );


            estado.textContent =
                "Error al iniciar";


            alert(
                "Error: " + error.message
            );


            if (stream) {

                stream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );

                stream = null;

            }

        }

    }
);


/* =========================
   DETECCIÓN
========================= */

function detectar() {

    if (
        !detectorActivo ||
        !stream
    ) {

        return;

    }


    const ahora =
        Date.now();


    const ctx =
        canvas.getContext("2d");


    // Mostrar cámara
    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Analizar solo cada cierto tiempo
    if (
        ahora - ultimoAnalisis >=
        INTERVALO_DETECCION
    ) {

        ultimoAnalisis =
            ahora;


        analizarRostros(ctx);

    }


    requestAnimationFrame(
        detectar
    );

}


/* =========================
   ANALIZAR ROSTROS
========================= */

function analizarRostros(ctx) {

    if (
        !faceCascade ||
        !stream
    ) {

        return;

    }


    let src = null;
    let gray = null;
    let faces = null;


    try {

        src =
            cv.imread(canvas);


        gray =
            new cv.Mat();


        faces =
            new cv.RectVector();


        cv.cvtColor(
            src,
            gray,
            cv.COLOR_RGBA2GRAY
        );


        faceCascade.detectMultiScale(
            gray,
            faces,
            1.1,
            5,
            0,
            new cv.Size(40, 40),
            new cv.Size(0, 0)
        );


        rostros.textContent =
            faces.size();


        for (
            let i = 0;
            i < faces.size();
            i++
        ) {

            const face =
                faces.get(i);


            ctx.strokeStyle =
                "#ff3030";


            ctx.lineWidth =
                3;


            ctx.strokeRect(
                face.x,
                face.y,
                face.width,
                face.height
            );


            ctx.fillStyle =
                "#ff3030";


            ctx.font =
                "bold 16px Arial";


            ctx.fillText(
                "Rostro",
                face.x,
                face.y - 8
            );

        }


    } catch (error) {

        console.error(
            "Error OpenCV:",
            error
        );


    } finally {

        if (src) {
            src.delete();
        }

        if (gray) {
            gray.delete();
        }

        if (faces) {
            faces.delete();
        }

    }

}


/* =========================
   DETENER
========================= */

detener.addEventListener(
    "click",
    () => {

        detectorActivo =
            false;


        if (stream) {

            stream
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

            stream = null;

        }


        video.srcObject =
            null;


        const ctx =
            canvas.getContext("2d");


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        rostros.textContent =
            "0";


        estado.textContent =
            "Cámara detenida";


        cameraMessage.style.display =
            "block";


        iniciar.disabled =
            false;

        detener.disabled =
            false;

    }
);