import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Hero, HeroCreateRequest } from '../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/heroes';

  getAll(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl);
  }

  getById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  searchByName(name: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl, {
      params: {
        name
      }
    });
  }
  create(Hero: HeroCreateRequest): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, Hero);
  }

  update(id: number, Hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/${id}`, Hero);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
