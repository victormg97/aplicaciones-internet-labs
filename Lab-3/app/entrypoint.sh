#!/bin/sh

# Aplicar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

# Crear un superusuario sin solicitar entrada
python manage.py createsuperuser --username $SUPER_USER_NAME --email $SUPER_USER_EMAIL --noinput

# Iniciar el servidor Django con Gunicorn
#gunicorn django_project.wsgi:application --bind 0.0.0.0:8000
python manage.py runserver 0.0.0.0:8000