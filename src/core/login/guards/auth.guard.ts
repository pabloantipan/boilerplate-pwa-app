import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionProvider } from 'login/providers/session.provider';
import { distinctUntilChanged, filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isSessionAlive = false

  constructor(
    private readonly router: Router,
    private readonly sessionProvider: SessionProvider,
  ) {
    this.sessionProvider.observeSession()
      .pipe(
        take(2),
        distinctUntilChanged((prev, curr) => {
          console.log('distinct', prev.status, curr.status);
          return prev.status === curr.status;
        }),
        filter(session => {
          console.log('filter', session.status)
          return session.status !== 'never';
        }),
      )
      .subscribe({
        next: (value) => {
          console.log('Another New Value:', value.status);
          if (['never', 'terminated'].includes(value.status)) {
            this.router.navigate(['login/sign-in']);
            return this.isSessionAlive = false;
          }
          return this.isSessionAlive = true;
        },
        error: (error) => {
          console.error('Error in AuthGuard', error);
        },
        complete: () => {
          console.log('AuthGuard Observable completed');
        }
      });
  }

  canActivate() {
    return true;
  }
}
