// Cuando el documento esté cargado
$(document).ready(function () {
    ////////// Variables //////////
    let nombre = $('#nombreForm').val();
    let apellido_paterno = $('#apellido_paternoForm').val();
    let apellido_materno = $('#apellido_maternoForm').val();
    let fecha_nacimiento = $('#fecha_nacimientoForm').val();
    const id_alumno = $('#form-editar').data('id');
    const formEditar = document.getElementById('form-editar');
    // Token de la página
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


    ////////// Variables //////////

    ////////// Funciones //////////
    // Función para convertir la fecha al formato YYYY-MM-DD
    function convertirFecha(fechaTexto) {
        // Obtén los componentes de la fecha (día, mes y año)
        const partes = fechaTexto.split(" de ");
        const dia = partes[0];
        const mes = partes[1];
        const año = partes[2];

        // Crea un objeto Date con la fecha en formato "Mes DD, YYYY"
        const fecha = new Date(`${mes} ${dia}, ${año}`);

        // Formatea la fecha como YYYY-MM-DD
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, "0"); // El mes es 0-indexado
        const dd = String(fecha.getDate()).padStart(2, "0");

        // Devuelve la fecha en formato YYYY-MM-DD
        return `${yyyy}-${mm}-${dd}`;
    }

    ////////// Botones //////////
    // Botón de editar
    function botonEditar() {
        $('#btn-editar').click(function () {
            $('.form-control-plaintext[readonly]').each(function () {
                $(this).prop('readonly', false);
                $(this).removeClass('form-control-plaintext');
                $(this).addClass('form-control');
            });
            // Convertir el id: fecha_nacimientoForm en un type date y dejarlo con los valores que tenía
            // Convierte la fecha y muestra el resultado en la consola
            const fechaFormateada = convertirFecha(fecha_nacimiento);

            $('#fecha_nacimientoForm').replaceWith('<input type="date" class="form-control" id="fecha_nacimientoForm" name="fecha_nacimiento" value="' + fechaFormateada + '" required>');

            // Convertir el botón editar en botón guardar, sin estar el elemento de botón guardar en el DOM
            $('#btn-editar').replaceWith('<button type="submit" class="btn btn-primary" id="btn-guardar">Guardar</button>');
            // Se agrega el botón de cancelar después del botón de guardar
            $('#btn-guardar').after('<button type="button" class="btn btn-secondary" id="btn-cancelar">Cancelar</button>');

            
        });
    }
    botonEditar();

    // Botón de eliminar
    $('#btn-eliminar').click(function () {
        Swal.fire({
            title: '¿Está seguro de eliminar este alumno?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Obtener id de asignatura
                const id_asignatura = $('#btn-eliminar').data('id');
                // Esperar unos segundos
                setTimeout(function () {
                    // Redireccionar
                    window.location.replace('/asignaturas/'+ id_asignatura + '/');
                }, 1500);
                // Se envía el formulario
                formEditar.action = '/alumnos/' + id_alumno + '/eliminar/';
                enviarServidor(1);
            }
        })
    });

    // Botón de cancelar
    $(document).on('click', '#btn-cancelar', function () {
        // Se elimina el botón de cancelar
        $('#btn-cancelar').remove();
        // Se convierte el botón guardar en botón editar
        $('#btn-guardar').replaceWith('<button type="button" class="btn btn-success" id="btn-editar"><i class="fas fa-pencil-alt"></i>&nbsp;Editar</button>');
        // Se reestablecen los valores de los input
        $('#nombreForm').val(nombre);
        $('#apellido_paternoForm').val(apellido_paterno);
        $('#apellido_maternoForm').val(apellido_materno);
        // Se convierte el input fecha de nacimiento en un input de texto
        $('#fecha_nacimientoForm').replaceWith('<input type="text" class="form-control-plaintext" id="fecha_nacimientoForm" name="fecha_nacimiento" readonly value="' + fecha_nacimiento + '" required>');

        // Se convierten los input en elementos de solo lectura
        $('.form-control').each(function () {
            $(this).prop('readonly', true);
            $(this).removeClass('form-control');
            $(this).addClass('form-control-plaintext');
        });

        botonEditar();
    });

    // Botón Guardar
    $('#form-editar').submit(function (e) {
        e.preventDefault();

        // Se elimina el botón de cancelar
        $('#btn-cancelar').remove();
        // Se convierte el botón guardar en botón editar
        $('#btn-guardar').replaceWith('<button type="button" class="btn btn-success" id="btn-editar"><i class="fas fa-pencil-alt"></i>&nbsp;Editar</button>');

        // Se actualizan las variables con los nuevos datos
        nombre = $('#nombreForm').val();
        apellido_paterno = $('#apellido_paternoForm').val();
        apellido_materno = $('#apellido_maternoForm').val();
        fecha_nacimiento = $('#fecha_nacimientoForm').val();
        console.log(fecha_nacimiento);
        // Se convierte la fecha al formato "DD de Mes, YYYY"
        const fecha = new Date(fecha_nacimiento);
        fecha.setDate(fecha.getDate() + 1);
        fecha.setUTCHours(0, 0, 0, 0);
        const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
        fecha_nacimiento = fecha.toLocaleDateString('es-ES', opcionesFecha);

        // Se actualizan los valores de los input con los nuevos datos
        $('#nombreForm').val(nombre);
        $('#apellido_paternoForm').val(apellido_paterno);
        $('#apellido_maternoForm').val(apellido_materno);
        // Se convierte el input fecha de nacimiento en un input de texto
        $('#fecha_nacimientoForm').replaceWith('<input type="text" class="form-control-plaintext" id="fecha_nacimientoForm" name="fecha_nacimiento" readonly value="' + fecha_nacimiento + '" required>');

        // Se convierten los input en elementos de solo lectura
        $('.form-control').each(function () {
            $(this).prop('readonly', true);
            $(this).removeClass('form-control');
            $(this).addClass('form-control-plaintext');
        });
        botonEditar();

        formEditar.action = '/alumnos/' + id_alumno + '/modificar/';

        // Se envía el formulario
        enviarServidor(0);
    });


    /////////// Botones //////////


    ////////// Validaciones //////////
    // Validación de campos
    $('#form-editar').validate({
        rules: {
            nombre: {
                required: true,
                maxlength: 25
            },
            apellido_paterno: {
                required: true,
                maxlength: 25
            },
            apellido_materno: {
                required: true,
                maxlength: 25
            },
            fecha_nacimiento: {
                required: true
            }
        },
        messages: {
            nombre: {
                required: 'Este campo es obligatorio',
                maxlength: 'Este campo debe tener un máximo de 50 caracteres'
            },
            apellido_paterno: {
                required: 'Este campo es obligatorio',
                maxlength: 'Este campo debe tener un máximo de 50 caracteres'
            },
            apellido_materno: {
                required: 'Este campo es obligatorio',
                maxlength: 'Este campo debe tener un máximo de 50 caracteres'
            },
            fecha_nacimiento: {
                required: 'Este campo es obligatorio'
            }
        }
    });
    ////////// Validaciones //////////

    ////////// Solicitud Fetch //////////
    // Función enviar al servidor
    function enviarServidor(editar_borrar) {
        // Se crea un objeto con los datos del formulario
        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('apellido_paterno', apellido_paterno);
        datos.append('apellido_materno', apellido_materno);
        datos.append('fecha_nacimiento', fecha_nacimiento);

        fetch(formEditar.action, {
            method: 'POST',
            body: datos,
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
            .then(response => {
                if (response.ok) {
                    if (editar_borrar == 0) {
                        Swal.fire({
                            position: 'top-end',
                            title: '¡Alumno actualizado!',
                            text: 'El alumno se ha actualizado correctamente',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else if (editar_borrar == 1) {
                        Swal.fire({
                            position: 'top-end',
                            title: '¡Alumno eliminado!',
                            text: 'El alumno se ha eliminado correctamente',
                            icon: 'success',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 1500,
                            allowEscapeKey: false,
                            allowEnterKey: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Obtener id de asgiantura mediante class anone
                                const id_asignatura = $('#btn-eliminar').data('id');
                                // Esperar unos segundos
                                setTimeout(function () {
                                    // Redireccionar
                                    window.location.replace('/asignaturas/'+ id_asignatura + '/');
                                }, 1500);
                            }
                        });
                    }
                } else {
                    throw new Error('Error en la respuesta');
                }
            })
            .catch(error => {
                console.log(error);
            });   
    }

});