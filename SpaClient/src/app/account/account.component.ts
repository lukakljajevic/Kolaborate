import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { UsersService } from '../services/users.service';
import { map, catchError, tap } from 'rxjs/operators';
import { UsernameValidator } from '../helpers/username-validator';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userSettingsForm: FormGroup;
  passwordForm: FormGroup;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImagePreview: any = '';
  imageFileName = '';
  @ViewChild('cropModal', {static: false})
  cropModal: ModalDirective;
  fileToUpload: File;

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

    this.croppedImagePreview = this.authService.avatar;
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

    if (!this.userSettingsForm.valid) {
      return;
    }

    this.usersService.updateUserSettings({username, fullName, avatar: this.fileToUpload})
      .subscribe((response: {avatarUrl: string}) => {
        alert('Successfully updated the user');
        const storageItem: {
          fullName: string,
          name: string,
          preferred_username: string,
          avatar: string,
          sub: string} = JSON.parse(sessionStorage.getItem('angular_spa_userData'));
        storageItem.name = username;
        storageItem.preferred_username = username;
        storageItem.fullName = fullName;
        storageItem.avatar = response.avatarUrl;
        sessionStorage.setItem('angular_spa_userData', JSON.stringify(storageItem));

        this.authService.username = username;
        this.authService.fullName = fullName;
        this.authService.avatar = response.avatarUrl;
        this.authService.refreshUserData();

      }, () => alert('Error updating the user'));
  }

  fileChangeEvent(event: any): void {
    const name = event.srcElement.files[0].name;
    // this.fileToUpload = event.srcElement.files[0];
    this.imageFileName = name;
    this.imageChangedEvent = event;
    this.cropModal.show();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.fileToUpload = new File([base64ToFile(event.base64)], this.imageFileName);
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  cropImage() {
    this.croppedImagePreview = this.croppedImage;
    this.cropModal.hide();
  }

  showModal(modal: ModalDirective) {
    modal.show();
  }

  hideModal(modal: ModalDirective) {
    modal.hide();
  }

  getImageName() {
    return this.imageFileName === '' ? 'Choose file' : this.imageFileName;
  }

  isSaveSettingsButtonEnabled(): boolean {
    const username = this.userSettingsForm.get('username').value;
    const fullName = this.userSettingsForm.get('fullName').value;
    const avatar = this.userSettingsForm.get('avatar').value;

    return this.userSettingsForm.valid &&
           (username !== this.authService.username ||
            fullName !== this.authService.fullName ||
            avatar !== null);
  }

}

function validatePasswords(form: FormGroup): ValidationErrors | null {
  const currentPassword = form.get('currentPassword').value;
  const newPassword = form.get('newPassword').value;
  const confirmNewPassword = form.get('confirmNewPassword').value;
  return (currentPassword === '' || newPassword === '' || newPassword !== confirmNewPassword) ?
    {invalidPasswords: true} : null;
}
