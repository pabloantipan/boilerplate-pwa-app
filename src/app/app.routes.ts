import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // loadComponent: () => import('../wrapper/wrapper.component').then(m => m.WrapperComponent),
    loadChildren: () => import('../core/wrapper/wrapper.routes').then(m => m.wrapperRoutes),
    // canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('../core/login/login.routes').then(r => r.loginRoutes),
  },
  // {
  //   path: '**',
  //   redirectTo: 'login/welcome',
  // },
];
