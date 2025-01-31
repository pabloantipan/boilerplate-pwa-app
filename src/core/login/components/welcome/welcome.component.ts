import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionProvider } from 'login/providers/session.provider';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  userData = {
    names: 'John Doe',
  };
  constructor(
    private router: Router,
    private sessionProvider: SessionProvider,
  ) { }

  public enterTheSite() {
    this.router.navigate(['/']);
  }

  public logout() {
    this.sessionProvider.signOut();
    this.router.navigate(['login/sign-in']);
  }
}
