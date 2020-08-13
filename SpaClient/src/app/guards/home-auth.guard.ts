import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeAuthGuard implements CanActivate {

  constructor(private router: Router,
              private oidcSecurityService: OidcSecurityService) { }

  canActivate(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map((isAuthorized: boolean) => {
          if (isAuthorized) {
            this.router.navigate(['/your-work']);
            return true;
          }
          return true;
      })
    );
  }
}
