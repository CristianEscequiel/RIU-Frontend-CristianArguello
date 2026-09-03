import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroesService } from './heroes.service';
import { Hero, HeroCreateRequest } from '../models/hero.model';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpTesting: HttpTestingController;

  const hero: Hero = {
    id: 1,
    name: 'Superman',
    superpower: 'Super fuerza y vuelo',
    weakness: 'Kryptonita',
    enemy: 'Lex Luthor',
  };

  const createRequest: HeroCreateRequest = {
    name: 'Superman',
    superpower: 'Super fuerza y vuelo',
    weakness: 'Kryptonita',
    enemy: 'Lex Luthor',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroesService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HeroesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all heroes', () => {
    const heroes = [hero];

    service.getAll().subscribe((response) => {
      expect(response).toEqual(heroes);
    });

    const request = httpTesting.expectOne('/api/heroes');

    expect(request.request.method).toBe('GET');

    request.flush(heroes);
  });

  it('should get a hero by id', () => {
    service.getById(1).subscribe((response) => {
      expect(response).toEqual(hero);
    });

    const request = httpTesting.expectOne('/api/heroes/1');

    expect(request.request.method).toBe('GET');

    request.flush(hero);
  });

  it('should search heroes by name', () => {
    service.searchByName('man').subscribe((response) => {
      expect(response).toEqual([hero]);
    });

    const request = httpTesting.expectOne(
      (req) => req.url === '/api/heroes' && req.params.get('name') === 'man',
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('name')).toBe('man');

    request.flush([hero]);
  });

  it('should create a hero', () => {
    service.create(createRequest).subscribe((response) => {
      expect(response).toEqual(hero);
    });

    const request = httpTesting.expectOne('/api/heroes');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(createRequest);

    request.flush(hero);
  });

  it('should update a hero', () => {
    const updatedHero: Hero = {
      ...hero,
      name: 'Superman Prime',
    };

    service.update(1, updatedHero).subscribe((response) => {
      expect(response).toEqual(updatedHero);
    });

    const request = httpTesting.expectOne('/api/heroes/1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedHero);

    request.flush(updatedHero);
  });

  it('should delete a hero', () => {
    service.delete(1).subscribe();

    const request = httpTesting.expectOne('/api/heroes/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null, {
      status: 204,
      statusText: 'No Content',
    });
  });
});
