import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { AuthException, InvalidCredentialsException, UnconfirmedEmailException } from '@login/exceptions/exceptions';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor() { }

  public async signIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: { user: { emailVerified: any; }; }) => {
        console.log('userCredential', userCredential);
        if (!userCredential.user.emailVerified) {
          throw new UnconfirmedEmailException('Please confirm your email');
        }
        return userCredential;
      })
      .catch((error: AuthException) => {
        if (error instanceof AuthException) {
          this.handleError(error)
        }
        console.log('error', error.message,);
        throw new InvalidCredentialsException('Invalid credentials');
      });
  }

  public async signOut() {
    return signOut(this.auth);
  }

  public async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: any) => {
        sendEmailVerification(userCredential.user);
        return userCredential;
      })
  }

  public async resetPassword(email: string) {
    sendPasswordResetEmail(this.auth, email);
  }

  public async sendEmailVerification() {
    const userCredential = (this.auth as any).currentUser;
    return sendEmailVerification(userCredential ?? {} as any);
  }

  private handleError(error: AuthException) {
    if (error instanceof InvalidCredentialsException) {
      console.error('Invalid credentials');
    }
    if (error instanceof UnconfirmedEmailException) {
      console.error('Please confirm your email');
    }
    throw error;
  }

}
