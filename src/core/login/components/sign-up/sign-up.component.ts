import { CommonModule } from '@angular/common';
import { Component, forwardRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import {
  IonButton, IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonContent,
  IonInput, IonItem, IonLabel
} from "@ionic/angular/standalone";
import { SessionProvider } from '@login/providers/session.provider';
import { merge } from 'rxjs';

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signUpButtonDisabled = true;
  form: FormGroup;
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  passwordTwiceErrorMessage = signal('');
  passwordDontMachErrorMessage = signal('');
  signUpAuthErrorMessage = signal('');

  constructor(
    private readonly sessionProvider: SessionProvider,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordTwice: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    this.showEmailValidationErrorMessage();
    this.subscribePasswordValidation();
    this.subscribeSignUpButtonDisabled();

    this.subscribePasswordOnceValidation();
    this.subscribePasswordTwiceValidation();

    this.subscribePasswordDontMachValidation();
    this.subscribeSignUpButtonDisabled();
  }

  public get emailFormControl() {
    return this.form.get('email') as any;
  }
  public get passwordFormControl() {
    return this.form.get('password') as any;
  }
  public get passwordTwiceFormControl() {
    return this.form.get('passwordTwice') as any;
  }

  public signUp() {
    const { email, password } = this.form.getRawValue();
    // this.showSpinner = true;
    this.sessionProvider.signUp(email ?? '', password ?? '');
  }

  public updateEmailErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      return this.emailErrorMessage.set('Por favor ingresa tu correo Office365');
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

  public updatePasswordTwiceErrorMessage() {
    if (this.passwordTwiceFormControl.hasError('required')) {
      return this.passwordTwiceErrorMessage.set('Por favor ingresa tu contraseña');
    }
    if (this.passwordTwiceFormControl.hasError('minlength')) {
      return this.passwordTwiceErrorMessage.set('Al menos 8 caracteres');
    }
    return this.passwordTwiceErrorMessage.set('');
  }

  public updatePasswordDontMachErrorMessage() {
    if (this.passwordFormControl.value !== this.passwordTwiceFormControl.value) {
      return this.passwordDontMachErrorMessage.set('Las contraseñas no coinciden');
    }
    return this.passwordDontMachErrorMessage.set('');
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

  private subscribeSignUpButtonDisabled() {
    merge(
      this.emailFormControl.valueChanges,
      this.passwordFormControl.valueChanges,
      this.passwordTwiceFormControl.valueChanges,
    )
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.signUpButtonDisabled = this.emailFormControl.valid
            && this.passwordFormControl.valid
            && this.passwordTwiceFormControl.valid
            && this.passwordFormControl.value === this.passwordTwiceFormControl.value
            ? false : true;
        },
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

  private subscribePasswordTwiceValidation() {
    merge(
      this.passwordTwiceFormControl.statusChanges,
      this.passwordTwiceFormControl.valueChanges,
    ).pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.updatePasswordTwiceErrorMessage(),
        error: (error: any) => console.error(error),
      });
  }

  private subscribePasswordDontMachValidation() {
    merge(
      this.passwordTwiceFormControl.valueChanges,
      this.passwordTwiceFormControl.valueChanges,
    ).pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.updatePasswordDontMachErrorMessage(),
        error: (error: any) => console.error(error),
      });
  }

}
