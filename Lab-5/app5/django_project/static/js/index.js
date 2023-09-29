// Obtén una referencia al select de géneros
var selectGeneros = $('#generos');

$(document).ready(function () {
    // rellenar select con id "generos" con los generos de la api "http://api.filmon.com/api/vod/genres"
    $.ajax({
        url: "http://api.filmon.com/api/vod/genres",
        type: "GET",
        dataType: "json",
        success: function (data) {
            // Verificar si la respuesta contiene géneros
            if (data && data.response && data.response.length > 0) {
                //var selectGeneros = $('#generos');
                
                // Iterar a través de los géneros y agregarlos al select
                data.response.forEach(function(genero) {
                    selectGeneros.append($('<option>', {
                        value: genero.id,
                        text: genero.name,
                        slug: genero.slug
                    }));
                });
            } else {
                console.log('No se encontraron géneros de películas.');
            }
        },
        error: function(error) {
            console.error('Error al obtener los géneros:', error);
        }
    });



    // Obtén una referencia a la tabla
    var tabla = $('#ipi-table tbody');

    // Maneja el evento de cambio en el select de géneros
    selectGeneros.change(function () {
        //obtener el nombre en minúscila
        var selectedGenre = $(this).find('option:selected').attr('slug');
        // Cambia el texto del <p> con id "tipo" al text del select
        $('#tipo').text($(this).find('option:selected').text());

        // Realiza una solicitud AJAX para obtener las películas del género seleccionado
        $.ajax({
            url: 'http://api.filmon.com/api/vod/search?genre=' + selectedGenre,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Limpia la tabla antes de agregar nuevas filas
                tabla.empty();

                // Itera a través de las películas y agrega una fila para cada una
                data.response.forEach(function (pelicula) {
                    var row = $('<tr>');
                    row.append($('<td>').text(pelicula.title));
                    row.append($('<td>').text(pelicula.description));

                    // Agrega la imagen con estilos para que sea responsiva y tenga un tamaño máximo
                    var imgTd = $('<td>');
                    var img = $('<img>');
                    img.attr('src', pelicula.poster.url);
                    img.attr('alt', pelicula.title);
                    img.addClass('img-fluid'); // Clase de Bootstrap para hacer la imagen responsiva
                    img.css('max-width', '175px'); // Tamaño máximo deseado
                    // hacer la imagen clickeable y vaya al link de la imagen
                    img.click(function() {
                        window.location.href = pelicula.poster.url;
                    });
                    // Cambiar el tipo de mouse cuando se pase sobre la imagen
                    img.hover(function() {
                        $(this).css('cursor', 'pointer');
                    });
                    imgTd.append(img);
                    row.append(imgTd);

                    console.log(pelicula.produced_date);

                    // Formatea la fecha de producción en el formato deseado
                    var producedDate = moment(pelicula.produced_date).format("D [de] MMMM [de] YYYY");
                    // si es null poner "Fecha de producción: Desconocida"
                    if (producedDate == "Invalid date") {
                        producedDate = "Fecha de producción: Desconocida";
                    }
                    row.append($('<td>').text("Fecha de producción: " + producedDate));

                    // Agrega la fila a la tabla
                    tabla.append(row);
                });
            },
            error: function (error) {
                console.error('Error al obtener las películas:', error);
            }
        });
    });
});