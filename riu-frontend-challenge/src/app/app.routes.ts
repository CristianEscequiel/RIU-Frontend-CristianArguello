import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
  },
  {
    path:'home',
    loadComponent: () =>
    import('./pages/home/home').then(m => m.Home)
  },
   {
    path: 'heroes',
    loadChildren: () =>
      import('./features/heroes/heroes.routes').then(
        (m) => m.HEROES_ROUTES
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found')
        .then(m => m.NotFound)
  }
];
