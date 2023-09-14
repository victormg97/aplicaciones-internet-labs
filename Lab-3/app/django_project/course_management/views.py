from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse  # Importa la función reverse
from django.http import JsonResponse
from .models import Asignatura, Alumno
from .forms import AsignaturaForm, AlumnoForm # Importar formularios

def index(request):
	asignaturas = Asignatura.objects.all()
	return render(request, 'index.html', {'asignaturas': asignaturas})

def crear_asignatura(request):
    if request.method == 'POST':
        form = AsignaturaForm(request.POST)  # Formulario de creación de asignatura
        if form.is_valid():
            form.save()
            # obtener la ultima asignatura guardada
            ultima_asignatura = Asignatura.objects.last()
            # redirigir a la página de detalle de la asignatura recién creada
            return redirect('detalle_asignatura', asignatura_id=ultima_asignatura.id)
    else:
        form = AsignaturaForm()
    return render(request, 'gestionar_asignaturas.html', {'form': form})

def detalle_asignatura(request, asignatura_id):
    asignatura = get_object_or_404(Asignatura, pk=asignatura_id)

    return render(request, 'detalle_asignatura.html', {'asignatura': asignatura})

def obtener_asignatura(request, asignatura_id):
	asignatura = get_object_or_404(Asignatura, pk=asignatura_id)
	data = {
		'codigo': asignatura.codigo,
		'nombre': asignatura.nombre,
	}
	return JsonResponse(data)

def gestionar_asignaturas(request):
    asignaturas = Asignatura.objects.all()
    return render(request, 'gestionar_asignaturas.html', {'asignaturas': asignaturas})

def listar_asignaturas(request):
    asignaturas = Asignatura.objects.all()
    data = []

    for asignatura in asignaturas:
        alumnos_count = asignatura.alumnos.count()  # Obtiene la cantidad de alumnos en la asignatura
        detalle_url = reverse('detalle_asignatura', args=[asignatura.id])
        editar_url = reverse('modificar_asignatura', args=[asignatura.id])
        eliminar_url = reverse('eliminar_asignatura', args=[asignatura.id])
        asignatura_id = asignatura.id
        data.append({
            'codigo': asignatura.codigo,
            'nombre': asignatura.nombre,
            'alumnos_count': alumnos_count,  # Agrega la cantidad de alumnos al diccionario
            'detalle_url': detalle_url,
            'editar_url': editar_url,
            'eliminar_url': eliminar_url,
            'asignatura_id': asignatura_id,
        })

    return JsonResponse(data, safe=False)

def modificar_asignatura(request, asignatura_id):
    asignatura = get_object_or_404(Asignatura, pk=asignatura_id)

    if request.method == 'POST':
        form = AsignaturaForm(request.POST, instance=asignatura)
        if form.is_valid():
            form.save()
            return redirect('gestionar_asignaturas')  # Redirige de vuelta a la gestión de asignaturas después de la edición
    else:
        form = AsignaturaForm(instance=asignatura)

    return render(request, 'gestionar_asignaturas.html', {'form': form, 'asignatura': asignatura})

def eliminar_asignatura(request, asignatura_id):
    asignatura = get_object_or_404(Asignatura, pk=asignatura_id)

    if request.method == 'DELETE':
        asignatura.delete()
        return redirect('gestionar_asignaturas')  # Redirige de vuelta a la gestión de asignaturas después de la eliminación

    return render(request, 'gestionar_asignaturas.html', {'asignatura': asignatura})



    
def crear_alumno(request, asignatura_id):
    # Obtén la asignatura específica por su ID
    asignatura = Asignatura.objects.get(pk=asignatura_id)

    if request.method == 'POST':
        form = AlumnoForm(request.POST)
        if form.is_valid():
            alumno = form.save()
            # Asocia este alumno a la asignatura obtenida
            asignatura.alumnos.add(alumno)
            return redirect('detalle_asignatura', asignatura_id=asignatura_id)
    else:
        form = AlumnoForm()

    return render(request, 'crear_alumno.html', {'form': form, 'asignatura': asignatura})

def detalle_alumno(request, alumno_id):
    alumno = get_object_or_404(Alumno, pk=alumno_id)

    # Obtén la asignatura asociada al alumno
    asignatura = alumno.asignatura.first()  # Suponiendo que un alumno puede estar en una sola asignatura

    if request.method == 'POST':
        # Puedes agregar aquí la lógica para manejar datos enviados por el formulario si es necesario
        pass

    return render(request, 'detalle_alumno.html', {'alumno': alumno, 'asignatura': asignatura})

def modificar_alumno(request, alumno_id):
    alumno = get_object_or_404(Alumno, pk=alumno_id)

    if request.method == 'POST':
        form = AlumnoForm(request.POST, instance=alumno)
        if form.is_valid():
            form.save()
            return redirect('detalle_alumno', alumno_id=alumno_id)
    else:
        form = AlumnoForm(instance=alumno)

    return render(request, 'modificar_alumno.html', {'form': form, 'alumno': alumno})

def eliminar_alumno(request, alumno_id):
    alumno = get_object_or_404(Alumno, pk=alumno_id)

    # Obtén la asignatura asociada al alumno
    asignatura = alumno.asignatura.first()  # Un alumno puede estar en una sola asignatura

    if request.method == 'POST':
        alumno.delete()
        # Redirige al usuario de vuelta a la página de detalles de la asignatura
        return redirect('detalle_asignatura', asignatura_id=asignatura.id)

    return render(request, 'eliminar_alumno.html', {'alumno': alumno})