import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Injectable()
export class AuthService {

  token: string;
  username: string;

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  login(username: string, password: string): Observable<object> {
    const body = new HttpParams()
      .set(`username`, username)
      .set(`password`, password);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpClient.post("http://localhost:8080/api/login", body.toString(), {headers: headers});
  }

  register(username: string, password: string): Observable<object> {
    const body = new HttpParams()
      .set(`username`, username)
      .set(`password`, password);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpClient.post("http://localhost:8080/api/register", body.toString(), {headers: headers});
  }

  logout() {
    this.token = undefined;
    this.username = undefined;
    this.router.navigate(["/login"]);
  }
}
