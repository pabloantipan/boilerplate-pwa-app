import { Route } from '@angular/router';
import { AliveSessionGuard } from './guards/alive-session.guard';


export const loginRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./login.page').then(m => m.LoginPageComponent),
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./components/sign-in/sign-in.component').then(m => m.SignInComponent),
        canActivate: [AliveSessionGuard],
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./components/sign-up/sign-up.component').then(m => m.SignUpComponent),
      },
      {
        path: 'welcome',
        loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent),
        canActivate: [AliveSessionGuard],
      },
      {
        path: '**',
        redirectTo: 'sign-in',
      }
    ],
  },
];
