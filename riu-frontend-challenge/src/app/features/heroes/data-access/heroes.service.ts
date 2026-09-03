import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero, HeroCreateRequest } from '../models/hero.model';
import { SKIP_GLOBAL_LOADING } from '../../../core/http-context/http-context.tokens';

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

  existsByName(name: string, excludeId?: number): Observable<boolean> {
    let params: Record<string, string> = {
      name,
    };
    if (excludeId) {
      params = {
        ...params,
        excludeId: String(excludeId),
      };
    }
    return this._http.get<boolean>(`${this._apiUrl}/exists`, {
      params,
      context: new HttpContext().set(SKIP_GLOBAL_LOADING, true),
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
