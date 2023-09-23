from django.core.paginator import Paginator
from django.shortcuts import render
from .models import Course, Student
import requests

def index(request):
    # Realiza la solicitud a la API de TMDb para obtener películas populares
    url = "https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMDEzN2FmNjYwNzNkZmJhZjZiNjU4NzUyMGIwMjZjMCIsInN1YiI6IjY1MDMxMTQ1MWJmMjY2MDEzYTc2M2FmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mVfmMw_On8ktv4mwPospO5YpqibaoEWVdH5fA3GHAQQ"
    }
    response = requests.get(url, headers=headers)
    
    # Parsea la respuesta JSON
    data = response.json()
    movies = data.get('results', [])

    # Configura la paginación
    paginator = Paginator(movies, 10)  # Divide en lotes de 10 películas por página
    page = request.GET.get('page')
    paginated_movies = paginator.get_page(page)

    return render(request, 'index.html', {'movies': paginated_movies})
