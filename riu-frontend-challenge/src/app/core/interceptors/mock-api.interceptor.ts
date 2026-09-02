import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';

import { HERO_MOCK } from '../../features/heroes/data-access/heroes.mock';
import { Hero, HeroCreateRequest } from '../../features/heroes/models/hero.model';

const API_DELAY = 800;

export const mockApiInterceptor: HttpInterceptorFn = (request, next) => {

  if (!request.url.startsWith('/api/heroes')) {
    return next(request);
  }

  if (request.method === 'GET' && request.url === '/api/heroes') {
    const heroes: Hero[] = getHeroes()
    const name = request.params.get('name')?.trim().toLowerCase();

    const filteredHeroes = name ? heroes.filter(hero =>
      hero.name.toLocaleLowerCase().includes(name)
    )
      : heroes;
    return of(
      new HttpResponse({
        status: 200,
        body: filteredHeroes,
      })
    ).pipe(delay(API_DELAY));
  }

  const detailMatch = request.url.match(/^\/api\/heroes\/(\d+)$/);

  if (request.method === 'GET' && detailMatch) {
    const id = Number(detailMatch[1]);
    const heroes: Hero[] = getHeroes()
    const hero = heroes.find((item) => item.id === id);

    if (!hero) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            error: {
              message: `No se encontró al heroe con id: ${id}`,
            },
          }),
      );
    }
    return of(
      new HttpResponse({
        status: 200,
        body: hero,
      }),
    ).pipe(delay(API_DELAY));
  }

  if (request.method === 'POST' && request.url === '/api/heroes') {
    if (!request.body) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
            error: {
              message: 'Cuerpo de solicitud inválido',
            },
          }),
      );

    }
    const body = request.body as HeroCreateRequest;
    const heroes: Hero[] = getHeroes()
    const ids = heroes.map((hero) => hero.id);
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const newHero: Hero = {
      ...body,
      id: nextId
    };

    heroes.push(newHero);
    saveHeroes(heroes)
    return of(
      new HttpResponse({
        status: 201,
        body: newHero,
      }),
    ).pipe(delay(API_DELAY));
  }

  if (request.method === 'PUT' && detailMatch) {
    const id = Number(detailMatch[1]);
    const heroes: Hero[] = getHeroes()
    const index = heroes.findIndex((item) => item.id === id);

    if (index === -1) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            error: {
              message: `No se encontró al heroe con id: ${id}`,
            },
          }),
      );
    }
    if (!request.body) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
            error: {
              message: `Solicitud inválida para el id: ${id}`,
            },
          }),
      );
    }
    const updatedHero: Hero = { ...heroes[index], ...request.body };

    heroes[index] = updatedHero;
    saveHeroes(heroes)

    return of(
      new HttpResponse({
        status: 200,
        body: heroes[index],
      }),
    ).pipe(delay(API_DELAY));
  }

  if (request.method === 'DELETE' && detailMatch) {
    const id = Number(detailMatch[1]);
    const heroes: Hero[] = getHeroes()
    const index = heroes.findIndex((item) => item.id === id);

    if (index === -1) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            error: {
              message: `No se encontró el id: ${id}`,
            },
          }),
      );
    }
    heroes.splice(index, 1);
    saveHeroes(heroes)

    return of(
      new HttpResponse({
        status: 204,
      }),
    ).pipe(delay(API_DELAY));
  }

  return next(request);

};

function getHeroes(): Hero[] {
  const savedHeroes = localStorage.getItem('heroes');

  if (savedHeroes) {
    return JSON.parse(savedHeroes) as Hero[];
  }

  const initialHeroes = [...HERO_MOCK];

  saveHeroes(initialHeroes)

  return initialHeroes;
}

function saveHeroes(heroes: Hero[]): void {
  localStorage.setItem(
    'heroes',
    JSON.stringify(heroes),
  );
}


