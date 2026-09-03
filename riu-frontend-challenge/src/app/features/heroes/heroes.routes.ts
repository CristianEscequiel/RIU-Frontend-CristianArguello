import { Routes } from '@angular/router';

export const HEROES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/heroes-list/heroes-list').then((m) => m.HeroesList),
    title: 'Superhéroes',
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/heroes-create/heroes-create').then((m) => m.HeroesCreate),
    title: 'Crear Superhéroe',
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/heroes-edit/heroes-edit').then((m) => m.HeroesEdit),
    title: 'Editar Superhéroe',
  },
];
