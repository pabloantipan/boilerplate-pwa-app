import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionProvider } from 'login/providers/session.provider';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AliveSessionGuard implements CanActivate {
  allowed = false;

  constructor(
    private router: Router,
    private sessionProvider: SessionProvider,
  ) {
    this.sessionProvider.observeSession()
      .pipe(
        take(2),
      )
      .subscribe({
        next: (value) => {
          console.log('Another New Value:', value.status);
          if (value.status === 'alive') {
            this.router.navigate(['login/welcome']);
            return this.allowed = true;
          }
          if (value.status === 'terminated') {
            this.router.navigate(['login/sign-in']);
            return this.allowed = true;
          }
          return this.allowed = false;
        },
        error: (error) => {
          console.error('Error in AuthGuard', error);
        },
        complete: () => {
          console.log('Observable completed');
        }
      });
  }

  async canActivate() {
    console.log('alive session guard', this.allowed);
    // if (!this.allowed) {
    //   this.router.navigate(['login/sign-in']);
    // }
    return this.allowed
  }

}
