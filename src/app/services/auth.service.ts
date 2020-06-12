import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { User } from '../models/user.model';
import { map, tap } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  private readonly AuthKey = 'authData';

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (!user) {
          return false;
        }
        return !!user.token;
      })
    );
  }

  get user() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (!user) {
          return null;
        }
        return user;
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (!user) {
          return null;
        }
        return user.token;
      })
    );
  }

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(tap(this.setUserDate.bind(this)));
  }

  signIn(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(tap(this.setUserDate.bind(this)));
  }

  signOut() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    localStorage.removeItem(this.AuthKey);
    this._user.next(null);
  }

  private setUserDate(authRes: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +authRes.expiresIn * 1000
    );

    const user = new User(
      authRes.localId,
      authRes.email,
      authRes.idToken,
      expirationTime
    );
    this._user.next(user);

    this.storeAuthData(
      authRes.localId,
      authRes.email,
      authRes.idToken,
      expirationTime.toISOString()
    );

    this.authLogout(user.tokenDuration);
  }

  private storeAuthData(
    userId: string,
    email: string,
    token: string,
    tokenExpirationDate: string
  ) {
    const data = JSON.stringify({ userId, email, token, tokenExpirationDate });
    localStorage.setItem(this.AuthKey, data);
  }

  autoLogin() {
    return of(localStorage.getItem(this.AuthKey)).pipe(
      map((storedData) => {
        if (!storedData) {
          return null;
        }

        const parsedData = JSON.parse(storedData) as {
          userId: string;
          email: string;
          token: string;
          tokenExpirationDate: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );

        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.authLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  private authLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.activeLogoutTimer = setTimeout(() => {
      this.signOut();
    }, duration);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
