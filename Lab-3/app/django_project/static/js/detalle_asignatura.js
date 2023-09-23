$(document).ready(function () {

    //////////////// Variables globales ///////////////////
    // Obtener el id de la asignatura
    let idAsignatura = $('#asignaturaId').val();
    let idAlumno = 0;
    let id_agregar_alumno = 0;
    let alumnos = [];
    const formAgregar = document.getElementById('formularioCrearAlumno');
    const listaAlumnos = document.getElementById('lista-alumnos').getAttribute('data-listar-alumnos-url');
    obtenerAlumnos();
    //////////////// Variables globales ///////////////////

    /////////////////// Funciones modal ///////////////////

    // Abrir modal
    $('#btnAgregarAlumno').on('click', function () {
        // Vaciar select con excepción del espacio 0
        $('#seleccionarAlumno').empty();
        // Añadir opción 0
        $('#seleccionarAlumno').append('<option value="0">Crear alumno o elejir existente</option>');

        // Rellenar select con los alumnos existentes
        alumnos.forEach(alumno => {
            $('#seleccionarAlumno').append('<option value="' + alumno.alumno_id + '">' + alumno.nombre + ' ' + alumno.apellido_paterno + ' ' + alumno.apellido_materno + ' ' + alumno.fecha_nacimiento + '</option>');
        });

        $('#modalAgregarAlumno').modal('show');
        // Al abrirl modal hacer focus en el primer input
        $('#seleccionarAlumno').focus();
    });

    // Cerrar modal
    $('.close').on('click', function () {
        $('#modalAgregarAlumno').modal('hide');
        // Al cerrar modal limpiar inputs
        limpiarFormulario();
    });

    // Limpiar formulario
    function limpiarFormulario() {
        $('#seleccionarAlumno option:first').prop('selected', true);
        $('#addNombre').val('');
        $('#addApellidoPaterno').val('');
        $('#addApellidoMaterno').val('');
        $('#addFechaNacimiento').val('');
    }

    // Si se elije un alumno de la lista select deshabilitar inputs, si se elije la opción 0 habilitar inputs
    $('#seleccionarAlumno').on('change', function () {
        if ($(this).val() == 0) {
            $('#addNombre').prop('disabled', false);
            $('#addApellidoPaterno').prop('disabled', false);
            $('#addApellidoMaterno').prop('disabled', false);
            $('#addFechaNacimiento').prop('disabled', false);
        } else {
            $('#addNombre').prop('disabled', true);
            $('#addApellidoPaterno').prop('disabled', true);
            $('#addApellidoMaterno').prop('disabled', true);
            $('#addFechaNacimiento').prop('disabled', true);
        }
    });
    /////////////////// Funciones modal ///////////////////

    /////////////////// Botones ///////////////////
    // Botón eliminar alumno
    $(document).on('click', '.btn-remove', function () {
        // Obtener el id del alumno
        const id = $(this).data('id');
        // Obtener el nombre del alumno con el id en la lista de alumnos
        const alumno = alumnos.find(alumno => alumno.alumno_id == id);

        // SweetAlert2
        Swal.fire({
            title: '¿Remover alumno de la asignatura?',
            text: "¡No se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e31414',
            cancelButtonColor: '##7a7272',

            confirmButtonText: 'Sí, bórralo!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Remover alumno
                removerAlumno(id);
            }
        });
    });




    /////////////////// Botones ///////////////////

    /////////////////// Submit Formulario ///////////////////
    // Detectar el envío del formulario
    $('#formularioCrearAlumno').on('submit', function (e) {
        e.preventDefault();

        // Iniciar variables
        const alumno = new FormData();
        var nombre = "";
        var apellido_paterno = "";
        var apellido_materno = "";
        var fecha_nacimiento = "";

        // Función agregar al Formdata
        function saveDatosAlumno() {
            alumno.append('nombre', nombre);
            alumno.append('apellido_paterno', apellido_paterno);
            alumno.append('apellido_materno', apellido_materno);
            alumno.append('fecha_nacimiento', fecha_nacimiento);
        }

        // Si está seleccionado un alumno ya creado de la lista, agregar este alumno a la asignatura y no crear uno nuevo
        idAlumno = $('#seleccionarAlumno').val();
        if (idAlumno != 0) {
            // Obtener el contenido seleccionado y separarlo por espacios
            //var contenidoSelect = $('#seleccionarAlumno option:selected').text().split(' ');

            // Obtener el id que está en value de la opción igualarlo a alumno_id en "alumnos" y obtener la data
            var contenidoSelect = $('#seleccionarAlumno option:selected').val().split(' ');

            // Obtener el id del alumno de this class="col" data-id="{{ alumno.id }}"
            idAlumno = $('#seleccionarAlumno option:selected').val();

            // Obtener los datos del alumno de un alumno en específico con esa id utilizando find
            var alumnoSeleccionado = alumnos.find(alumno => alumno.alumno_id == idAlumno);
            nombre = alumnoSeleccionado.nombre;
            apellido_paterno = alumnoSeleccionado.apellido_paterno;
            apellido_materno = alumnoSeleccionado.apellido_materno;
            fecha_nacimiento = alumnoSeleccionado.fecha_nacimiento;

            formAgregar.setAttribute('action', '/asignaturas/' + idAsignatura + '/agregar_alumno/' + idAlumno + '/');
        } else {
            // Obtener valores de los inputs
            nombre = $('#addNombre').val();
            apellido_paterno = $('#addApellidoPaterno').val();
            apellido_materno = $('#addApellidoMaterno').val();
            fecha_nacimiento = $('#addFechaNacimiento').val();
            // Validar que los campos no estén vacíos
            if (nombre == '' || apellido_paterno == '' || apellido_materno == '' || fecha_nacimiento == '') {
                // SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Todos los campos son obligatorios',
                });
                return false;
            }

            // Validar que los campos no sean ya existentes en la lista de alumnos, si son salir de la función
            var alumnoExistente = alumnos.find(alumno => alumno.nombre == nombre && alumno.apellido_paterno == apellido_paterno && alumno.apellido_materno == apellido_materno && alumno.fecha_nacimiento == fecha_nacimiento);
            if (alumnoExistente) {
                // SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Ups...',
                    text: 'El alumno ya existe, elija desde la lista',
                });
                return false;
            }
            formAgregar.setAttribute('action', '/asignaturas/' + idAsignatura + '/crear_alumno/');
        }

        // Agregar los datos del alumno al FormData
        saveDatosAlumno();
        // Enviar datos al servidor
        enviarDatosAlServidor(alumno);
    });

    /////////////////// Submit Formulario ///////////////////

    /////////////////// Funciones Fetch ///////////////////////
    // Función enviar datos al servidor
    function enviarDatosAlServidor(alumno) {
        // Obtener el formulario
        const formData = new FormData(formAgregar);

        fetch(formAgregar.getAttribute('action'), {
            method: 'POST',
            body: alumno,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    // SweetAlert2 alumno agregado correctamente
                    Swal.fire({
                        icon: 'success',
                        title: 'Alumno agregado correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Ocultar id "sinAlumnos"
                    $('#sinAlumnos').hide();

                    if(idAlumno != 0){
                        id_agregar_alumno = idAlumno;
                    }else{
                        // Añadir alumno a la página con id tarjeta-alumno
                        // get alumno_id de la lista alumnos y sumarle 1
                        id_agregar_alumno = alumnos[alumnos.length - 1].alumno_id + 1;
                    }
                    
                    
                    $('#tarjeta-alumno').append('<div class="col"><div class="card radius-15"><div class="card-body text-center"><div class="p-4 border radius-15"><h5 class="mb-0 mt-5">' + alumno.get('nombre') + ' ' + alumno.get('apellido_paterno') + ' ' + alumno.get('apellido_materno') + '</h5><p class="mb-3">' + alumno.get('fecha_nacimiento') + '</p><div class="list-inline contacts-social mt-3 mb-3"><button type="button" class="btn btn-danger btn-remove" data-id="{{ alumno.id }}"><iclass="fa fa-ban"></i></button></div><div class="d-grid"><a href="/alumnos/' + id_agregar_alumno + '/" class="btn btn-outline-info radius-15"><i class="fa fa-info-circle">Detalle</i></a></div></div></div></div></div>');

                    // Cerrar modal
                    $('#modalAgregarAlumno').modal('hide');

                    // Limpiar formulario
                    limpiarFormulario();
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Función obtener alumnos existentes
    function obtenerAlumnos() {
        fetch(listaAlumnos)
            .then(response => response.json())
            .then(data => {
                alumnos = data;
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Función remover alumno
    function removerAlumno(id) {
        // Obtener el formulario
        const formData = new FormData(formAgregar);

        fetch('/asignaturas/' + idAsignatura + '/remover_alumno/' + id + '/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    // SweetAlert2 alumno eliminado correctamente
                    Swal.fire({
                        icon: 'success',
                        title: 'Alumno removido correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Remover el alumno de la lista de alumnos
                    alumnos = alumnos.filter(alumno => alumno.alumno_id != id);

                    // Remover el alumno de la página clase col data-id
                    $('.col').remove('[data-id=' + id + ']');

                    // Si no hay alumnos en la lista mostrar id "sinAlumnos"
                    if (alumnos.length == 0) {
                        $('#sinAlumnos').show();
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    /////////////////// Funciones Fetch ///////////////////
});