import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Movie, Genre } from './movie';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app de Películas';

  movies: Movie[] = [];
  genres: Genre[] = [];
  form: FormGroup = this.fb.group({
    genre: ['']
  });

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.genres = [];
    this.form = this.fb.group({
      genre: ['']
    });
  }

  ngOnInit() {
    this.getGenres();
  }

  onGenreChange() {
    this.getMovies();
  }

  ngOnChanges() {
    if (this.form.dirty && this.form.valid) {
      this.movies = [];
      this.genres.forEach((genre) => {
        if (genre.id === this.form.value.genre) {
          this.movies = this.movies.concat(genre.movies);
        }
      });
    }
  }

  async getGenres() {
    const url = 'http://api.filmon.com/api/vod/genres';
    const response = await this.http.get(url);
    this.genres = this.genres.map((genre) => {
      return genre as Genre;
    });
  }

  async getMovies() {
    const genre = this.form.value.genre;
    if (genre) {
      const url = `http://api.filmon.com/api/vod/genres/${genre}/movies`;
      const response = await this.http.get(url);
      this.movies = this.movies.map((movie) => {
        return movie as Movie;
      }); 
    } else {
      this.movies = [];
    }
  }
}
