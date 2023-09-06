document.getElementById("guardarDatos").addEventListener("click", function() {
    // Obtén los datos de la tabla
    var tabla = document.getElementById("tablaDatos");
    var filas = tabla.getElementsByTagName("tr");
    var nuevosDatos = [];

    for (var i = 1; i < filas.length; i++) {
        var celdas = filas[i].getElementsByTagName("td");
        var id = celdas[0].textContent;
        var nombre = celdas[1].textContent;
        var apellido = celdas[2].textContent;
        nuevosDatos.push({ id: id, nombre: nombre, apellido: apellido });
    }

    // Enviar los nuevos datos al servidor mediante Fetch
    fetch("../php/guardarDatos.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevosDatos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Los datos se han guardado correctamente.");
        } else {
            alert("Error al guardar los datos.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
