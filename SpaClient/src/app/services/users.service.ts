import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserListItem } from '../models/user-list-item';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _avatar: Subject<string> = new Subject();

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  get avatar$() { return this._avatar.asObservable(); }

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

    return this.http.put(`http://localhost:5000/users/${userId}`, formData).pipe(
      flatMap(() => {
        if (userData.avatar) {
          formData.append('avatar', userData.avatar, userData.avatar.name);
        }
        return this.http.put(`http://localhost:5002/api/users`, formData);
      })
    );
  }

  register() {
    const user = {
      id: this.authService.userId,
      username: this.authService.username,
      fullName: this.authService.fullName
    };

    this.http.post('http://localhost:5002/api/users', user)
      .subscribe({
        next: () => console.log('successfully registered user on api')
      });
  }

  

}
