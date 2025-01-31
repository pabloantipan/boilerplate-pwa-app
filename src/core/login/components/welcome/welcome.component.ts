import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton, IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonContent,
  IonInput, IonItem, IonLabel
} from "@ionic/angular/standalone";
import { SessionProvider } from '@login/providers/session.provider';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonLabel,
    IonItem,
    IonContent,
    IonInput,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInput),
      multi: true,
    },
  ],
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
