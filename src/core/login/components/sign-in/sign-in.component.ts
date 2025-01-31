import { CommonModule } from '@angular/common';
import { Component, forwardRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR,
  ReactiveFormsModule, Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton, IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonContent,
  IonInput, IonItem, IonLabel
} from "@ionic/angular/standalone";
import { InvalidCredentialsException, UnconfirmedEmailException } from '@login/exceptions/exceptions';
import { sendConfirmationEmail } from '@login/functions/send-confirmation-email.function';
import { SessionProvider } from '@login/providers/session.provider';
import { NotificationBucketProvider } from '@shared/widgets/notification-bucket';
import { merge } from 'rxjs';

@Component({
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
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signUpButtonDisabled = true;
  form: FormGroup;

  public get emailFormControl() {
    return this.form.get('email') as any;
  }

  public get passwordFormControl() {
    return this.form.get('password') as any;
  }

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  signUpAuthErrorMessage = signal('');

  constructor(
    private readonly sessionProvider: SessionProvider,
    private notificationBucketProvider: NotificationBucketProvider,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {

    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    this.showEmailValidationErrorMessage();
    this.subscribePasswordValidation();
    this.subscribePasswordOnceValidation();
    this.subscribeSignUpButtonDisabled();
  }


  public signIn() {
    const { email, password } = this.form.getRawValue();
    // this.showSpinner = true;
    this.sessionProvider.signIn(email ?? '', password ?? '')
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        if (error instanceof InvalidCredentialsException) {
          return this.notificationBucketProvider.addNotification({
            message: 'Credenciales inválidas',
            type: 'error',
            permanent: false,
          });
        }

        if (error instanceof UnconfirmedEmailException) {
          return this.notificationBucketProvider.addNotification({
            message: 'Por favor confirma tu correo',
            action: {
              label: 'Reenviar correo',
              callback: sendConfirmationEmail,
            },
            type: 'error',
            permanent: true,
          });
        }

        return this.notificationBucketProvider.addNotification({
          message: 'Error desconocido',
          type: 'error',
          permanent: false,
        });

      });
  }

  public updateEmailErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      return this.emailErrorMessage.set('Por favor ingresa tu correo valido');
    }
    if (this.emailFormControl.hasError('email')) {
      return this.emailErrorMessage.set('Ingresa un correo válido');
    }
    return this.emailErrorMessage.set('');
  }

  public updatePasswordErrorMessage() {
    if (this.passwordFormControl.hasError('required')) {
      return this.passwordErrorMessage.set('Por favor ingresa tu contraseña');
    }
    if (this.passwordFormControl.hasError('minlength')) {
      return this.passwordErrorMessage.set('Al menos 8 caracteres');
    }
    return this.passwordErrorMessage.set('');
  }

  private showEmailValidationErrorMessage() {
    merge(
      this.emailFormControl.statusChanges,
      this.emailFormControl.valueChanges,
    ).pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.updateEmailErrorMessage();
        },
        error: (error: any) => console.error(error),
      });
  }

  private subscribePasswordValidation() {
    merge(
      this.passwordFormControl.statusChanges,
      this.passwordFormControl.valueChanges,
    ).pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.updatePasswordErrorMessage(),
        error: (error: any) => console.error(error),
      });
  }

  private subscribePasswordOnceValidation() {
    merge(
      this.passwordFormControl.statusChanges,
      this.passwordFormControl.valueChanges,
    ).pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.updatePasswordErrorMessage(),
        error: (error: any) => console.error(error),
      });
  }

  private subscribeSignUpButtonDisabled() {
    merge(
      this.emailFormControl.statusChanges,
      this.passwordFormControl.statusChanges,
    ).pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.signUpButtonDisabled = !(
            this.emailFormControl.valid
            && this.passwordFormControl.valid
          );
        },
        error: (error: any) => console.error(error),
      });
  }

}
