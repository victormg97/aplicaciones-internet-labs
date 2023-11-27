import { HttpClient } from '@angular/common/http';

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
  genres: string[];
}

export interface Genre {
  id: number;
  name: string;
  movies: Movie[];
}