const loader = document.getElementById("loader");

// =====================================================
// ELEMENTOS - IMAGEN
// =====================================================

const sectionUpload = document.getElementById("sectionUpload");
const btnModeUpload = document.getElementById("btnModeUpload");
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const btnProcess = document.getElementById("btnProcess");

const imgOriginal = document.getElementById("imgOriginal");
const boxOriginal = document.getElementById("boxOriginal");

const imgResult = document.getElementById("imgResult");
const uploadResult = document.getElementById("uploadResult");


// =====================================================
// ELEMENTOS - CÁMARA
// =====================================================

const sectionCamera = document.getElementById("sectionCamera");
const btnModeCamera = document.getElementById("btnModeCamera");

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvasFrame");

const cameraResult = document.getElementById("cameraResult");
const cameraPlaceholder =
    document.getElementById("cameraPlaceholder");

const cameraFaceCount =
    document.getElementById("cameraFaceCount");

const btnStartCamera =
    document.getElementById("btnStartCamera");

const btnStopCamera =
    document.getElementById("btnStopCamera");

const btnToggleCamera =
    document.getElementById("btnToggleCamera");

const metricsZone =
    document.getElementById("metricsZone");

const faceCount =
    document.getElementById("faceCount");


// =====================================================
// VARIABLES
// =====================================================

let selectedFile = null;

let streamInstance = null;

let detectionTimer = null;

let isStreaming = false;

let processingFrame = false;


// =====================================================
// CAMBIAR A IMAGEN
// =====================================================

btnModeUpload.addEventListener("click", () => {

    btnModeUpload.classList.add("active");

    btnModeCamera.classList.remove("active");

    sectionUpload.classList.remove("d-none");

    sectionCamera.classList.add("d-none");

    stopCameraFlow();
});


// =====================================================
// CAMBIAR A CÁMARA
// =====================================================

btnModeCamera.addEventListener("click", () => {

    btnModeCamera.classList.add("active");

    btnModeUpload.classList.remove("active");

    sectionCamera.classList.remove("d-none");

    sectionUpload.classList.add("d-none");
});


// =====================================================
// DRAG & DROP
// =====================================================

["dragenter", "dragover"].forEach(eventName => {

    dropZone.addEventListener(eventName, e => {

        e.preventDefault();

        dropZone.classList.add("drag-active");
    });
});


["dragleave", "drop"].forEach(eventName => {

    dropZone.addEventListener(eventName, e => {

        e.preventDefault();

        dropZone.classList.remove("drag-active");
    });
});


dropZone.addEventListener("drop", e => {

    if (e.dataTransfer.files.length > 0) {

        handleFile(e.dataTransfer.files[0]);
    }
});


fileInput.addEventListener("change", e => {

    if (e.target.files.length > 0) {

        handleFile(e.target.files[0]);
    }
});


// =====================================================
// CARGAR IMAGEN
// =====================================================

function handleFile(file) {

    if (!file || !file.type.startsWith("image/")) {

        return;
    }

    selectedFile = file;

    btnProcess.disabled = false;

    const reader = new FileReader();

    reader.onload = e => {

        imgOriginal.src = e.target.result;

        imgOriginal.classList.remove("d-none");

        boxOriginal.classList.remove("d-none");

        uploadResult.classList.add("d-none");
    };

    reader.readAsDataURL(file);
}


// =====================================================
// DETECTAR IMAGEN
// =====================================================

btnProcess.addEventListener("click", async () => {

    if (!selectedFile) {

        return;
    }

    const formData = new FormData();

    formData.append("image", selectedFile);

    loader.classList.remove("d-none");

    const data =
        await sendFrameToBackend(formData);

    loader.classList.add("d-none");


    if (data && data.success) {

        imgResult.src = data.image;

        uploadResult.classList.remove("d-none");

        metricsZone.classList.remove("d-none");

        faceCount.textContent =
            data.faces_detected;
    }
});


// =====================================================
// BOTÓN INICIAR CÁMARA
// =====================================================

btnStartCamera.addEventListener("click", async () => {

    await initCamera();
});


// =====================================================
// INICIAR CÁMARA
// =====================================================

async function initCamera() {

    try {

        console.log("Solicitando cámara...");


        // ---------------------------------------------
        // DETENER CUALQUIER STREAM ANTERIOR
        // ---------------------------------------------

        if (streamInstance) {

            streamInstance
                .getTracks()
                .forEach(track => track.stop());

            streamInstance = null;
        }


        // ---------------------------------------------
        // PEDIR CÁMARA
        // ---------------------------------------------
        //
        // IMPORTANTE:
        // No forzamos 640x480.
        // No forzamos facingMode.
        //
        // Dejamos que Windows/navegador
        // elijan la cámara compatible.
        //

        streamInstance =
            await navigator.mediaDevices.getUserMedia({

                video: true,

                audio: false
            });


        console.log(
            "Cámara obtenida correctamente"
        );


        // ---------------------------------------------
        // CONECTAR CÁMARA AL VIDEO
        // ---------------------------------------------

        video.srcObject = streamInstance;


        // ---------------------------------------------
        // ESTADO
        // ---------------------------------------------

        isStreaming = true;

        processingFrame = false;


        // ---------------------------------------------
        // BOTONES
        // ---------------------------------------------

        btnStartCamera.disabled = true;

        btnStopCamera.disabled = false;

        btnToggleCamera.style.display =
            "none";


        // ---------------------------------------------
        // REPRODUCIR VIDEO
        // ---------------------------------------------

        try {

            await video.play();

            console.log(
                "Video iniciado correctamente"
            );

        } catch (error) {

            console.error(
                "Error reproduciendo video:",
                error
            );
        }


        // ---------------------------------------------
        // ESPERAR ANTES DE DETECTAR
        // ---------------------------------------------

        setTimeout(() => {

            if (isStreaming) {

                console.log(
                    "Iniciando detección..."
                );

                startDetection();
            }

        }, 1000);


    } catch (error) {

        console.error(
            "ERROR DE CÁMARA:",
            error
        );


        // Limpiar estado
        isStreaming = false;

        processingFrame = false;


        if (streamInstance) {

            streamInstance
                .getTracks()
                .forEach(track => track.stop());

            streamInstance = null;
        }


        video.srcObject = null;


        // Restaurar botones
        btnStartCamera.disabled = false;

        btnStopCamera.disabled = true;

        btnToggleCamera.style.display =
            "none";


        alert(
            "No se pudo iniciar la cámara.\n\n" +
            "Cierra otras aplicaciones que estén usando la cámara e inténtalo nuevamente."
        );
    }
}


// =====================================================
// INICIAR DETECCIÓN
// =====================================================

function startDetection() {

    stopDetection();


    /*
        La cámara funciona independientemente.

        Solo tomamos una captura cada 700 ms
        para mandarla a OpenCV.
    */

    detectionTimer =
        setInterval(() => {

            if (
                isStreaming &&
                !processingFrame
            ) {

                processCameraFrame();
            }

        }, 700);
}


// =====================================================
// DETENER DETECCIÓN
// =====================================================

function stopDetection() {

    if (detectionTimer) {

        clearInterval(detectionTimer);

        detectionTimer = null;
    }
}


// =====================================================
// CAPTURAR FRAME
// =====================================================

async function processCameraFrame() {

    if (
        !isStreaming ||
        processingFrame ||
        video.readyState < 2
    ) {

        return;
    }


    processingFrame = true;


    // ---------------------------------------------
    // RESOLUCIÓN PEQUEÑA PARA OPENCV
    // ---------------------------------------------

    const width = 320;
    const height = 240;


    canvas.width = width;
    canvas.height = height;


    const ctx =
        canvas.getContext("2d");


    // Capturar frame
    ctx.drawImage(
        video,
        0,
        0,
        width,
        height
    );


    // ---------------------------------------------
    // CONVERTIR A JPG
    // ---------------------------------------------

    canvas.toBlob(

        async blob => {

            if (!blob) {

                processingFrame = false;

                return;
            }


            const formData =
                new FormData();


            formData.append(
                "image",
                blob,
                "camera.jpg"
            );


            try {

                // ---------------------------------
                // ENVIAR AL BACKEND
                // ---------------------------------

                const data =
                    await sendFrameToBackend(
                        formData
                    );


                if (
                    !isStreaming ||
                    !data ||
                    !data.success
                ) {

                    return;
                }


                // ---------------------------------
                // ACTUALIZAR CONTADOR
                // ---------------------------------

                cameraFaceCount.textContent =
                    data.faces_detected;


                // ---------------------------------
                // MOSTRAR RESULTADO
                // ---------------------------------

                if (
                    data.faces_detected > 0
                ) {

                    cameraResult.src =
                        data.image;


                    cameraResult.classList.remove(
                        "d-none"
                    );


                    cameraPlaceholder.classList.add(
                        "d-none"
                    );
                }


            } catch (error) {

                console.error(
                    "Error procesando frame:",
                    error
                );

            } finally {

                processingFrame = false;
            }

        },

        "image/jpeg",

        0.45
    );
}


// =====================================================
// ENVIAR AL BACKEND
// =====================================================

async function sendFrameToBackend(formData) {

    try {

        const response =
            await fetch(
                "/api/detect",
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            console.error(
                "Respuesta HTTP:",
                response.status
            );

            return null;
        }


        const data =
            await response.json();


        console.log(
            "Caras detectadas:",
            data.faces_detected
        );


        return data;


    } catch (error) {

        console.error(
            "Error enviando imagen:",
            error
        );

        return null;
    }
}


// =====================================================
// DETENER CÁMARA
// =====================================================

btnStopCamera.addEventListener(
    "click",
    stopCameraFlow
);


function stopCameraFlow() {

    // Detener detección
    stopDetection();


    // Estado
    isStreaming = false;

    processingFrame = false;


    // Detener cámara
    if (streamInstance) {

        streamInstance
            .getTracks()
            .forEach(track => track.stop());

        streamInstance = null;
    }


    // Quitar cámara del video
    video.srcObject = null;


    // Botones
    btnStartCamera.disabled = false;

    btnStopCamera.disabled = true;

    btnToggleCamera.style.display =
        "none";


    // Reiniciar contador
    cameraFaceCount.textContent = "0";


    // Ocultar resultado
    cameraResult.classList.add(
        "d-none"
    );


    // Mostrar placeholder
    cameraPlaceholder.classList.remove(
        "d-none"
    );
}


// =====================================================
// CAMBIAR CÁMARA
// =====================================================
//
// Por ahora está desactivado deliberadamente.
// Primero dejamos una cámara funcionando
// de forma estable.
//

btnToggleCamera.addEventListener(
    "click",
    () => {

        console.log(
            "Cambio de cámara desactivado temporalmente."
        );
    }
);