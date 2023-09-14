from django import forms
from .models import Asignatura, Alumno

class AsignaturaForm(forms.ModelForm):
    class Meta:
        model = Asignatura
        fields = ['codigo', 'nombre']
        labels = {
            'codigo': 'Código Asignatura',
            'nombre': 'Nombre de la Asignatura',
        }
        widgets = {
            'codigo': forms.TextInput(attrs={'class': 'form-control'}),
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
        }

class AlumnoForm(forms.ModelForm):
    class Meta:
        model = Alumno
        fields = ['nombre', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento']
        labels = {
            'nombre': 'Nombre del alumno',
            'apellido_paterno': 'Apellido Paterno del alumno',
            'apellido_materno': 'Apellido Materno del alumno',
            'fecha_nacimiento': 'Fecha de Nacimiento del alumno',
        }
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'apellido_paterno': forms.TextInput(attrs={'class': 'form-control'}),
            'apellido_materno': forms.TextInput(attrs={'class': 'form-control'}),
            'fecha_nacimiento': forms.DateInput(attrs={'class': 'form-control'}),
        }

