import { Injectable } from "@angular/core";
import { AsyncValidator, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UsernameValidator {

  static createValidator(authService: AuthService, usersService: UsersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {

      if (authService.username === control.value) {
        return of(null);
      }

      return usersService.isUsernameTaken(control.value).pipe(
        tap(response => console.log(response)),
        map((response: {isTaken: boolean}) => response.isTaken ? {usernameTaken: true} : null),
        catchError(() => of(null))
      );
    }


  }
}
