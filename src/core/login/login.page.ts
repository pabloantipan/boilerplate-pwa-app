import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    // SignInComponent,
    // SignUpComponent,
    // WelcomeComponent,
    RouterModule,
  ],
  providers: [
  ],
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPageComponent {
  constructor() { }
}
