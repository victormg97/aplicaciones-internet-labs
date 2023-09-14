from django.contrib import admin

# Register your models here.
from .models import Asignatura, Alumno
register = admin.site.register
register(Asignatura)
register(Alumno)
