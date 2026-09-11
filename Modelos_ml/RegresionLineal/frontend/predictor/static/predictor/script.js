function predecirPrecio() {

    const area = document.getElementById("area").value;
    const resultado = document.getElementById("resultado");

    if (!area || area <= 0) {

        resultado.innerHTML = `
            <p class="result-title">Error</p>
            <p class="result-value">
                Ingresa una superficie válida.
            </p>
        `;

        return;
    }

    resultado.innerHTML = `
        <p class="result-title">Calculando...</p>
    `;

    fetch("http://127.0.0.1:8000/predict", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            area_m2: parseFloat(area)
        })
    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Error en la API");
        }

        return response.json();
    })

    .then(data => {

        resultado.innerHTML = `
            <p class="result-title">Precio estimado</p>

            <p class="result-value">
                $${data.predicted_price.toLocaleString("es-CO")} COP
            </p>
        `;

    })

    .catch(error => {

        console.error(error);

        resultado.innerHTML = `
            <p class="result-title">Error</p>

            <p class="result-value">
                No se pudo conectar con la API.
            </p>
        `;
    });
}