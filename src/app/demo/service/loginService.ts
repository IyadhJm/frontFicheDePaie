import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from 'src/app/login/login';



@Injectable({
  providedIn: 'root'
})
export class AppService {

  log = new Login()
  private url = "http://localhost:8082/users";
  

  constructor(private http: HttpClient) { }


  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {
      username,
      password
    };
    return this.http.post(`${this.url}/login`, body);
  }
 
}