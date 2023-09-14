from django.db import models

# Create your models here.

class Asignatura(models.Model):
    codigo = models.CharField(max_length=10)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Alumno(models.Model):
    nombre = models.CharField(max_length=50)
    apellido_paterno = models.CharField(max_length=50)
    apellido_materno = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    asignatura = models.ManyToManyField(Asignatura, blank=True, related_name='alumnos')

    def __str__(self):
        return self.nombre + " " + self.apellido_paterno + " " + self.apellido_materno
