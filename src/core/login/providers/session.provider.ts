import { inject, Injectable } from '@angular/core';
import { Auth, authState, idToken } from '@angular/fire/auth';
// import { LocalStorage, NotificationBucketProvider, SessionStorage } from '@front-lib';
// import { VaultKeyProvider } from '@providers/vault-key/vault-key.provider';
import { SESSION_STORAGE_KEYS } from '@login/constants/session.constants';
import { observeConfirmationEmailSending } from '@login/functions/send-confirmation-email.function';
import { DEFAULT_SESSION, Session, SessionStatus } from '@login/interfaces/auth.interfaces';
import { AuthService } from '@login/services/auth.service';
import { LocalStorage } from '@shared/browser-storage/local-storage';
import { SessionStorage } from '@shared/browser-storage/session-storage';
import { NotificationBucketProvider } from '@shared/widgets/notification-bucket';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionProvider {
  private auth: Auth = inject(Auth);
  private _authState$ = authState(this.auth);
  private _idToken$ = idToken(this.auth);
  private _sessionSubject = new BehaviorSubject<Session>(DEFAULT_SESSION);
  private reaction = new Subject<void>();

  public observeSession() {
    return this._sessionSubject.asObservable();
  }

  constructor(
    // private readonly vaultKeyProvider: VaultKeyProvider,
    private readonly authService: AuthService,
    private readonly localStorage: LocalStorage,
    private readonly sessionStorage: SessionStorage,
    private notificationBucketProvider: NotificationBucketProvider,
  ) {
    this._authState$.subscribe(async (fbUser: any | null) => {
      console.log('fbUser', fbUser);
      // this.sessionStorage.clear();
      // this.localStorage.clear();
      if (!fbUser) {
        this.saveSession(DEFAULT_SESSION);
        return this._sessionSubject.next({ ...DEFAULT_SESSION, status: 'terminated' });
      }

      this.saveSession(this.mapSession(fbUser, 'alive'));
      this._sessionSubject.next(this.mapSession(fbUser, 'alive'));
    });

    observeConfirmationEmailSending().subscribe(() => {
      console.log('observeConfirmationEmailSending');
      this.reaction.next();
    });

    this.reaction.subscribe(() => {
      console.log('reaction');
      this.notificationBucketProvider.addNotification({
        message: 'Revisa tu email para confirmar tu cuenta',
        type: 'info',
        liveSpanSec: 10,
        permanent: false,
      });
    });

    this.notificationBucketProvider.addNotification({
      message: 'Revisa tu email para confirmar tu cuenta',
      type: 'info',
      liveSpanSec: 10,
      permanent: false,
    });
  }

  public async signUp(email: string, password: string): Promise<Session> {
    return this.authService.signUp(email, password).then(async (userCredential) => {
      const token = await userCredential.user.getIdToken();

      const session = {
        uid: userCredential.user.uid,
        email: userCredential.user.email ?? 'empty',
        displayName: userCredential.user.displayName ?? 'empty',
        token,
        status: 'alive' as SessionStatus,
      };

      this._sessionSubject.next(session);
      return session;
    });
  }

  public async signIn(email: string, password: string): Promise<Session> {
    return this.authService.signIn(email, password)
      .then(async (userCredential) => {
        const token = await userCredential.user.getIdToken();

        const session = {
          uid: userCredential.user.uid,
          email: userCredential.user.email ?? 'empty',
          displayName: userCredential.user.displayName ?? 'empty',
          token,
          status: 'alive' as SessionStatus,
        };

        this._sessionSubject.next(session);
        return session;
      });
  }

  public async signOut(): Promise<void> {
    await this.authService.signOut();
    this._sessionSubject.next({ ...DEFAULT_SESSION, status: 'terminated' });
  }

  public async sendEmailVerification(): Promise<void> {
    return this.authService.sendEmailVerification();
  }

  public mapSession(user: any, status: SessionStatus): Session {
    return {
      uid: user.uid ?? 'empty',
      email: user.email ?? 'empty',
      displayName: user.displayName ?? 'empty',
      token: user.accessToken ?? 'empty',
      status,
    };
  }

  private saveSession(session: Session): void {
    this.sessionStorage.save(SESSION_STORAGE_KEYS.userName, session.displayName);
    this.sessionStorage.save(SESSION_STORAGE_KEYS.userEmail, session.email);
    this.localStorage.save(SESSION_STORAGE_KEYS.sessionToken, session.token);
  }

}
