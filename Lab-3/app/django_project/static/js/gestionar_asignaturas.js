// gestionar_asignaturas.js

// Usa listarAsignaturasUrl definida en el template
const listarAsignaturasUrl = document.getElementById('url-data').getAttribute('data-listar-asignaturas-url');

// Variable para almacenar todas las asignaturas una vez se carguen
let asignaturas = [];
let asignaturaId = 0;

// Variable para saber si se está creando o editando una asignatura
// 0 = Crear, 1 = Editar
let crear_editar = 0;
let mensaje = '';

// Función abrir modal
function abrirModal() {
    $('#modalEditarAsignatura').modal('show');
}

// Crear la tabla con Grid.js vacia
const grid = new gridjs.Grid({
    columns: [
        { name: 'Nombre Asignatura', id: 'nombre' },
        { name: 'Código Asignatura', id: 'codigo' },
        { name: 'Alumnos', id: 'alumnos' },
        {
            name: 'Acciones', id: 'acciones', formatter: (cell, row) => {
                return gridjs.html(`${row.cells[3].data}`);
            }
        },
    ],
    data: [],
    pagination: {
        enabled: true,
        limit: 10,
        summary: true,
    },
    search: true,
    language: {
        search: {
            placeholder: 'Buscar Asignatura...'
        },
        pagination: {
            previous: '<',
            next: '>',
            showing: 'Mostrando',
            results: () => 'Asignaturas',
            of: 'de',
            to: 'a',
            on: 'en'
        },
        noRecordsFound: 'No se encontraron asignaturas',
    }
}).render(document.getElementById('grid'));

// Función para actualizar la tabla
function actualizarTabla() {
    grid.updateConfig({
        data: asignaturas.map(asignatura => [
            asignatura.nombre,
            asignatura.codigo,
            asignatura.alumnos_count,
            `<button type="button" class="btn btn-primary" onclick="window.location.href='${asignatura.detalle_url}'">Ver</button> |
            <button type="button" class="btn btn-warning btn-edit" data-asignatura-id="${asignatura.asignatura_id}">Editar</button> |
            <button type="button" class="btn btn-danger btn-delete" data-asignatura-id="${asignatura.asignatura_id}">Eliminar</button>`,
        ]),
    }).forceRender();
}

// Realizar la solicitud GET a la API
fetch(listarAsignaturasUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        //console.log(data); // Imprime los datos en la consola para verificar
        asignaturas = data;

        // Actualizar la tabla Grid.js
        actualizarTabla()
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });

// Script para abrir el modal y editar la asignatura
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        $('#modalEditarAsignatura').modal('hide');
        document.getElementById('editNombre').classList.remove('is-invalid');
        document.getElementById('editCodigo').classList.remove('is-invalid');
    }

    // Botón para editar asignatura
    if (event.target.classList.contains('btn-edit')) {
        asignaturaId = parseInt(event.target.getAttribute('data-asignatura-id'));

        // set a "Editar asignatura"
        const modal = document.getElementById('modalEditarAsignatura');
        modal.querySelector('.modal-title').textContent = 'Editar asignatura';
        crear_editar = 1;

        // Actualiza la acción del formulario con el id de la asignatura
        const formularioModificarAccion = document.getElementById('formularioEditarAsignatura');
        formularioModificarAccion.action = `/asignaturas/${asignaturaId}/modificar/`;

        console.log('Editar asignatura con ID:', asignaturaId);

        // Obtener los datos de la asignatura para prellenar el formulario
        const asignatura = asignaturas.find(asignatura => asignatura.asignatura_id === asignaturaId);

        document.getElementById('editNombre').value = asignatura.nombre;
        document.getElementById('editCodigo').value = asignatura.codigo;

        // Abrir el modal
        abrirModal();
    }

    // Botón para eliminar asignatura
    if (event.target.classList.contains('btn-delete')) {
        asignaturaId = parseInt(event.target.getAttribute('data-asignatura-id'));
        console.log('Eliminar asignatura con ID:', asignaturaId);

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir los cambios",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Realizar la solicitud DELETE a la API
                //window.location.href = `/asignaturas/${asignaturaId}/eliminar/`;
                fetch(`/asignaturas/${asignaturaId}/eliminar/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': document.getElementById('csrfmiddlewaretoken').value
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            // SweetAlert para mostrar mensaje de éxito se cierra en 2 segundos
                            Swal.fire({
                                title: 'Asignatura eliminada',
                                icon: 'success',
                                timer: 900,
                                showConfirmButton: false,
                            });

                            // Actualizar la tabla
                            // Obtener el índice de la asignatura
                            const index = asignaturas.findIndex(asignatura => asignatura.asignatura_id === asignaturaId);

                            // Eliminar la asignatura de la lista
                            asignaturas.splice(index, 1);

                            // Actualizar la tabla
                            actualizarTabla();

                        } else {
                            console.log('Hubo un problema al realizar los cambios');
                            // Manejar el caso en el que la solicitud no fue exitosa, como mostrar un mensaje de error
                        }
                    })
                    .catch(error => {
                        // Manejar errores de conexión u otros errores
                    });
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function () {

    // Botón para crear asignatura
    // Al botón crear asignatura con id crear-asignatura-btn
    const crearAsignaturaBtn = document.getElementById('crear-asignatura-btn');
    crearAsignaturaBtn.addEventListener('click', function () {
        // set "Crear asignatura"
        const modal = document.getElementById('modalEditarAsignatura');
        modal.querySelector('.modal-title').textContent = 'Crear nueva Asignatura';
        crear_editar = 0;

        // Limpiar el formulario
        document.getElementById('editNombre').value = '';
        document.getElementById('editCodigo').value = '';

        // Actualiza la acción del formulario con el id de la asignatura
        const formularioModificarAccion = document.getElementById('formularioEditarAsignatura');
        formularioModificarAccion.action = `/asignaturas/crear/`;

        // Abrir el modal
        abrirModal();
    });


    // Script para cerrar el modal con clase close
    document.querySelectorAll('.close').forEach(function (element) {
        element.addEventListener('click', function () {
            $('#modalEditarAsignatura').modal('hide');
            document.getElementById('editNombre').classList.remove('is-invalid');
            document.getElementById('editCodigo').classList.remove('is-invalid');
        });
    });

    const formularioModificar = document.getElementById('formularioEditarAsignatura');

    formularioModificar.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
        console.log('Formulario enviado');

        const formData = new FormData(formularioModificar);
        const nombre = document.getElementById('editNombre').value;
        const codigo = document.getElementById('editCodigo').value;
        const formDatos = new FormData();
        formDatos.append('nombre', nombre);
        formDatos.append('codigo', codigo);

        fetch(formularioModificar.getAttribute('action'), {
            method: 'POST',
            body: formDatos,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    if (crear_editar == 0) {
                        mensaje = "Creada exitosamente";
                        const url = response.url;

                        const asignatura_id_local = parseInt(url.split('/').slice(-2)[0]);

                        console.log('Asignatura creada con ID:', asignatura_id_local);

                        // Agregar la asignatura a la lista
                        asignaturas.push({
                            asignatura_id: asignatura_id_local,
                            nombre: nombre,
                            codigo: codigo,
                            alumnos_count: 0,
                            detalle_url: `/asignaturas/${asignatura_id_local}/`,
                        });
                    } else {
                        mensaje = "Editada exitosamente";

                        // Actualizar la tabla
                        // Obtener el índice de la asignatura
                        const index = asignaturas.findIndex(asignatura => asignatura.asignatura_id === asignaturaId);

                        // Actualizar los datos de la asignatura
                        asignaturas[index].nombre = nombre;
                        asignaturas[index].codigo = codigo;
                    }

                    // SweetAlert para mostrar mensaje de éxito se cierra en 2 segundos
                    Swal.fire({
                        title: mensaje,
                        icon: 'success',
                        timer: 900,
                        showConfirmButton: false,
                    });

                    // Cerrar el modal después de editar
                    $('#modalEditarAsignatura').modal('hide');

                    // Actualizar la tabla
                    actualizarTabla();
                } else {
                    // Sweet alert para mostrar mensaje de error
                    Swal.fire({
                        title: 'Error al crear asignatura',
                        icon: 'error',
                        timer: 900,
                        showConfirmButton: false,
                    });
                }
            })
            .catch(error => {
                // Manejar errores de conexión u otros errores
            });
    });

    $('#modalEditarAsignatura').on('shown.bs.modal', function () {
        $('#editNombre').focus();
    });
});