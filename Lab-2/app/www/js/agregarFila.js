// Agregar una fila dinámicamente con javascript y dom
function agregarFila(id, nombre, apellido) {
    var tabla = document.getElementById("tablaDatos").getElementsByTagName('tbody')[0];
    var nuevaFila = tabla.insertRow(tabla.rows.length);
    var cell1 = nuevaFila.insertCell(0);
    var cell2 = nuevaFila.insertCell(1);
    var cell3 = nuevaFila.insertCell(2);
    cell1.innerHTML = id;
    cell2.innerHTML = nombre;
    cell3.innerHTML = apellido;
}

// let que obtiene el último id de la tabla
let id = document.getElementById("tablaDatos").rows.length;

// Obtener los campos nombre y apellido del formulario para utilizar la funcion agregarFila
let nombre = document.getElementById("nombre");
let apellido = document.getElementById("apellido");

// Agregar un evento al formulario para que cuando se envíe se agregue una fila a la tabla
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (nombre.value != "" && apellido.value != "") {
        agregarFila(id, nombre.value, apellido.value);
        id++;
        nombre.value = "";
        apellido.value = "";
    } else {
        alert("Los campos no pueden estar vacíos");
    }
});

// // Guardar los datos de la tabla en el base de datos con ajax
// function guardarDatos() {
//     let tabla = document.getElementById("tablaDatos");
//     let filas = tabla.rows.length;
//     let datos = [];
//     for (let i = 1; i < filas; i++) {
//         let fila = tabla.rows[i];
//         let celdas = fila.cells;
//         let dato = {
//             id: celdas[0].innerHTML,
//             nombre: celdas[1].innerHTML,
//             apellido: celdas[2].innerHTML
//         };
//         datos.push(dato);
//     }
//     $.ajax({
//         type: "POST",
//         url: "../php/guardarDatos.php",
//         data: JSON.stringify(datos),
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         success: function (data) {
//             alert("Datos guardados correctamente");
//         },
//         failure: function (errMsg) {
//             alert(errMsg);
//         }
//     });
// }
