import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  token: string;
  username: string;

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<object> {
    return this.httpClient.post("http://localhost:8080/api/login", {
      username: username,
      password: password
    });
  }

  register(username: string, password: string): Observable<object> {
    return this.httpClient.post("http://localhost:8080/api/register", {
      username: username,
      password: password
    });
  }

  logout() {
    this.token = undefined;
    this.username = undefined;
  }
}
