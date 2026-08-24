import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';

import { HERO_MOCK } from '../../features/heroes/data-access/heroes.mock';
import { Hero , HeroCreateRequest } from '../../features/heroes/models/hero.model';

const API_DELAY = 800;

export const mockApiInterceptor: HttpInterceptorFn = (request, next) => {

  if (!request.url.startsWith('/api/heroes')) {
    return next(request);
  }

  if (request.method === 'GET' && request.url === '/api/heroes') {
    return of(
      new HttpResponse({
        status: 200,
        body: HERO_MOCK,
      }),
    ).pipe(delay(API_DELAY));
  }

  const detailMatch = request.url.match(/^\/api\/heroes\/(\d+)$/);

  if (request.method === 'GET' && detailMatch) {
    const id = Number(detailMatch[1]);
    const hero = HERO_MOCK.find((item) => item.id === id);

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

    const newWorkOrder: Hero = {
      ...body,
      id: HERO_MOCK.length + 1,
    };

    HERO_MOCK.push(newWorkOrder);
    return of(
      new HttpResponse({
        status: 201,
        body: newWorkOrder,
      }),
    ).pipe(delay(API_DELAY));
  }

  if (request.method === 'PUT' && detailMatch) {
    const id = Number(detailMatch[1]);
    const index = HERO_MOCK.findIndex((item) => item.id === id);

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
    const updatedHero: Hero = { ...HERO_MOCK[index], ...request.body };
    HERO_MOCK[index] = updatedHero;

    return of(
      new HttpResponse({
        status: 200,
        body: HERO_MOCK[index],
      }),
    ).pipe(delay(API_DELAY));
  }

  if (request.method === 'DELETE' && detailMatch) {
    const id = Number(detailMatch[1]);
    const index = HERO_MOCK.findIndex((item) => item.id === id);

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

    HERO_MOCK.splice(index, 1);

    return of(
      new HttpResponse({
        status: 204,
      }),
    ).pipe(delay(API_DELAY));
  }

  return next(request);
};
