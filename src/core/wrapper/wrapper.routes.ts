import { Route } from '@angular/router';
// import { AuthGuard } from 'login/guards/auth.guard';


export const wrapperRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./wrapper.component').then(c => c.WrapperComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('../pages/home/home.page').then(r => r.HomePage),
        // canActivate: [AuthGuard],
      },
      // {
      //   path: 'showcase',
      //   loadComponent: () => import('../pages/showcase/showcase.page').then(r => r.ShowcasePageComponent),
      // },
      // {
      //   path: '**',
      //   redirectTo: 'home',
      // }
    ],
  },
];
