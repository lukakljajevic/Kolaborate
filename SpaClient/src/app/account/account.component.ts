import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { UsersService } from '../services/users.service';
import { map, catchError, tap } from 'rxjs/operators';
import { UsernameValidator } from '../helpers/username-validator';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userSettingsForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private authService: AuthService,
              private usersService: UsersService) { }

  ngOnInit() {
    this.userSettingsForm = new FormGroup({
      username: new FormControl(this.authService.username, {
        updateOn: 'blur',
        validators: Validators.required,
        asyncValidators: UsernameValidator.createValidator(this.authService, this.usersService)
      }),
      fullName: new FormControl(this.authService.fullName, Validators.required),
      avatar: new FormControl(null)
    });

    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmNewPassword: new FormControl('')
    }, {validators: [validatePasswords]});
  }

  changePassword() {
    console.log(this.passwordForm.value);
    const currentPassword = this.passwordForm.value.currentPassword;
    const newPassword = this.passwordForm.value.newPassword;
    this.authService.updatePassword(currentPassword, newPassword)
      .subscribe(
        () => alert('Successfully updated the password.'),
        () => alert('Error updating the password.'),
        () => {
          this.passwordForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          });
        }
      );
  }

  validateUsername(control: FormControl): Observable<boolean> {
    if (this.authService.username === control.value) {
      return of(null);
    }

    return this.usersService.isUsernameTaken(control.value).pipe(
      tap(response => console.log(response)),
      map((response: {isTaken: boolean}) => response.isTaken ? {usernameTaken: true} : null),
      catchError(() => of(null))
    );
  }

  updateUserSettings() {
    const username = this.userSettingsForm.value.username;
    const fullName = this.userSettingsForm.value.fullName;

    console.log(this.userSettingsForm.value);

    if (!this.userSettingsForm.valid
        || (username === this.authService.username
            && fullName === this.authService.fullName)) {
      return;
    }
    console.log('here');
    this.usersService.updateUserSettings({username, fullName})
      .subscribe(() => {
        alert('Successfully updated the user');
        const storageItem: {
          fullName: string,
          name: string,
          preferred_username: string,
          sub: string} = JSON.parse(sessionStorage.getItem('angular_spa_userData'));
        storageItem.name = username;
        storageItem.preferred_username = username;
        storageItem.fullName = fullName;
        sessionStorage.setItem('angular_spa_userData', JSON.stringify(storageItem));

        this.authService.username = username;
        this.authService.fullName = fullName;
        this.authService.refreshUserData();

      }, () => alert('Error updating the user'));
  }

}

function validatePasswords(form: FormGroup): ValidationErrors | null {
  const currentPassword = form.get('currentPassword').value;
  const newPassword = form.get('newPassword').value;
  const confirmNewPassword = form.get('confirmNewPassword').value;
  return (currentPassword === '' || newPassword === '' || newPassword !== confirmNewPassword) ?
    {invalidPasswords: true} : null;
}
