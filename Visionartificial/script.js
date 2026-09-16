const video = document.getElementById("video");

const iniciar = document.getElementById("iniciar");

const detener = document.getElementById("detener");

const estado = document.getElementById("estado");


iniciar.addEventListener("click", () => {

    video.src = "/video_feed";

    estado.textContent = "Cámara activa - Detectando rostros...";

});


detener.addEventListener("click", () => {

    video.src = "";

    estado.textContent = "Cámara detenida";

});