import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserListItem } from '../models/user-list-item';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(fullName: string): Observable<UserListItem[]> {
    return this.http.post<UserListItem[]>('http://localhost:5000/users', {fullName});
  }
}
