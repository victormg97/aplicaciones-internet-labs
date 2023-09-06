/* // Espera a que se cargue la página
document.addEventListener("DOMContentLoaded", function() {
    // Realiza una solicitud GET al servidor para obtener los datos desde PHP

    fetch('../php/obtenerDatos.php')
        .then(response => response.json())
        .then(data => {
            // Llena la tabla con los datos obtenidos
            llenarTabla(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Función para llenar la tabla con los datos
    function llenarTabla(data) {
        var tabla = document.getElementById('tablaDatos');
        var tbody = tabla.querySelector('tbody');

        // Limpia el contenido actual de la tabla
        tbody.innerHTML = '';

        // Itera sobre los datos y agrega filas a la tabla
        data.forEach(function (row) {
            var newRow = tbody.insertRow();
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);

            cell1.textContent = row.id;
            cell2.textContent = row.name;
            cell3.textContent = row.last_name;
        });
    }
});
 */

$(document).ready(function() {
    // Realiza una solicitud AJAX para obtener los datos desde PHP
    $.ajax({
        url: '../php/obtenerDatos.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Llama a la función para llenar la tabla con los datos
            llenarTabla(data);
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });

    // Función para llenar la tabla con los datos
    function llenarTabla(data) {
        var tablaBody = $('#tablaBody');

        // Limpia el contenido actual de la tabla
        tablaBody.empty();

        // Itera sobre los datos y agrega filas a la tabla
        $.each(data, function(index, row) {
            var newRow = '<tr>' +
                '<td>' + row.id + '</td>' +
                '<td>' + row.name + '</td>' +
                '<td>' + row.last_name + '</td>' +
                '</tr>';
            tablaBody.append(newRow);
        });
    }
});