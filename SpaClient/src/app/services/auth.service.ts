import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userDataSubscription: Subscription;
  private fullName: string;
  private userId: string;

  constructor(private http: HttpClient,
              private oidcSecurityService: OidcSecurityService) {
    this.userDataSubscription = this.oidcSecurityService.userData$.subscribe(userData => {
      if (userData != null) {
        this.fullName = userData.fullName;
        this.userId = userData.sub;
      }
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth();
  }

  getFullName() {
    return this.fullName;
  }

  getToken() {
    return this.oidcSecurityService.getToken();
  }

  getUserId() {
    return this.userId;
  }

  updatePassword(currentPassword: string, newPassword: string) {
    return this.http.post('http://localhost:5000/auth/password', {currentPassword, newPassword, userId: this.userId});
  }

}


