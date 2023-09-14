from django.urls import path
from django.contrib import admin

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name="index"),  # Página de inicio

    path('asignaturas/crear/', views.crear_asignatura, name='crear_asignatura'),  # Crear asignatura
    path('asignaturas/<int:asignatura_id>/', views.detalle_asignatura, name='detalle_asignatura'),  # Detalle de asignatura
    path('asignaturas/<int:asignatura_id>/obtener/', views.obtener_asignatura, name='obtener_asignatura'),  # Obtener asignatura
    path('gestionar_asignaturas/', views.gestionar_asignaturas, name='gestionar_asignaturas'), # Gestionar asignaturas
    path('listar_asignaturas/', views.listar_asignaturas, name='listar_asignaturas'), # Listar asignaturas
    path('asignaturas/<int:asignatura_id>/modificar/', views.modificar_asignatura, name='modificar_asignatura'), # Modificar asignatura
    path('asignaturas/<int:asignatura_id>/eliminar/', views.eliminar_asignatura, name='eliminar_asignatura'), # Eliminar asignatura


    path('asignaturas/<int:asignatura_id>/crear_alumno/', views.crear_alumno, name='crear_alumno'),  # Crear alumno
    path('alumnos/<int:alumno_id>/', views.detalle_alumno, name='detalle_alumno'),  # Detalle de alumno
    path('alumnos/<int:alumno_id>/modificar/', views.modificar_alumno, name='modificar_alumno'), # Modificar alumno
    path('alumnos/<int:alumno_id>/eliminar/', views.eliminar_alumno, name='eliminar_alumno'), # Eliminar alumno
]