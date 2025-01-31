import { sendEmailVerification } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { NobodyIsLoggedInException } from 'login/exceptions/exceptions';
import { Subject } from 'rxjs';

// this should be in the backend in order to avoid multiple requests for an email verification

const _confirmationEmailSubject = new Subject<void>();

export function observeConfirmationEmailSending() {
  return _confirmationEmailSubject.asObservable();
}

export function sendConfirmationEmail(): void {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      return await sendEmailVerification(user).then(() => {
        return _confirmationEmailSubject.next();
      });
    }
    throw new NobodyIsLoggedInException()
  });
}
