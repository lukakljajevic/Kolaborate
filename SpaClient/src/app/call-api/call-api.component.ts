import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-call-api',
  templateUrl: './call-api.component.html',
  styleUrls: ['./call-api.component.css']
})
export class CallApiComponent implements OnInit {

  response: string;

  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) { }

  ngOnInit() {
    const headers = new HttpHeaders({Authorization: 'Bearer ' +  this.oidcSecurityService.getToken()});
    this.http.get('http://localhost:5002/api/secret', {headers})
      .subscribe((response: {data: string}) => this.response = response.data);
  }

}
