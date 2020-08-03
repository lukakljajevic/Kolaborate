import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, Subscription, Subject } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _fullName: string;
  private _userId: string;
  private _username: string;
  private _avatar: string = '';
  private _userData: Subject<{fullName: string, username: string}> = new Subject();

  constructor(private http: HttpClient,
              // private usersService: UsersService,
              private oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.userData$.subscribe(userData => {
      if (userData != null) {
        this._fullName = userData.fullName;
        this._userId = userData.sub;
        this._username = userData.name;
        this.getAvatar();
      }
    });
  }

  get userData$() { return this._userData.asObservable(); }

  refreshUserData() { this._userData.next({username: this._username, fullName: this._fullName}); }

  isLoggedIn(): Observable<boolean> { return this.oidcSecurityService.checkAuth(); }

  get fullName() { return this._fullName; }

  set fullName(value: string) { this._fullName = value; }

  getToken() { return this.oidcSecurityService.getToken(); }

  get userId() { return this._userId; }

  get username() { return this._username; }

  set username(value: string) { this._username = value; }

  get avatar() { return this._avatar === '' ? 'assets/default-avatar.png' : `http://localhost:5002/${this._avatar}`; }

  set avatar(value: string) { this._avatar = value; }

  updatePassword(currentPassword: string, newPassword: string) {
    return this.http.post('http://localhost:5000/auth/password', {currentPassword, newPassword, userId: this.userId});
  }

  private getAvatar() {
    this.http.get(`http://localhost:5002/api/users/avatar`)
      .subscribe((response: {avatar: string}) => this._avatar = response.avatar);
  }

}


