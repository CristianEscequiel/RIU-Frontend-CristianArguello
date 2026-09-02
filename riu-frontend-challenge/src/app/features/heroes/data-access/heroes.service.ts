import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Hero, HeroCreateRequest } from '../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = '/api/heroes';

  getAll(): Observable<Hero[]> {
    return this._http.get<Hero[]>(this._apiUrl);
  }

  getById(id: number): Observable<Hero> {
    return this._http.get<Hero>(`${this._apiUrl}/${id}`);
  }

  searchByName(name: string): Observable<Hero[]> {
    return this._http.get<Hero[]>(this._apiUrl, {
      params: {
        name
      }
    });
  }
  create(hero: HeroCreateRequest): Observable<Hero> {
    return this._http.post<Hero>(this._apiUrl, hero);
  }

  update(id: number, hero: Hero): Observable<Hero> {
    return this._http.put<Hero>(`${this._apiUrl}/${id}`, hero);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
