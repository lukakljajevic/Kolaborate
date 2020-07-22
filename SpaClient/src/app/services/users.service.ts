import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserListItem } from '../models/user-list-item';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getUsers(fullName: string): Observable<UserListItem[]> {
    return this.http.post<UserListItem[]>('http://localhost:5000/users', {fullName});
  }

  isUsernameTaken(username: string) {
    return this.http.post<{isTaken: boolean}>('http://localhost:5000/users/taken', {username});
  }

  updateUserSettings(userData: {username: string, fullName: string, avatar: File, password: string}) {
    const userId = this.authService.userId;

    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('fullName', userData.fullName);
    formData.append('password', userData.password);
    if (userData.avatar) {
      formData.append('avatar', userData.avatar, userData.avatar.name);
    }

    return this.http.put(`http://localhost:5000/users/${userId}`, formData);
      // .pipe(
      //   catchError(error => alert(error.error.message))
      // );
  }
}
