import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userSettingsForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userSettingsForm = new FormGroup({

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

}

function validatePasswords(form: FormGroup): ValidationErrors | null {
  const currentPassword = form.get('currentPassword').value;
  const newPassword = form.get('newPassword').value;
  const confirmNewPassword = form.get('confirmNewPassword').value;
  return (currentPassword === '' || newPassword === '' || newPassword !== confirmNewPassword) ?
    {invalidPasswords: true} : null;
}
