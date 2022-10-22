import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { AuthData } from './auth-data.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient){}

  /**
   *
   * @param email
   * @param password
   *
   * Send request to backend to create a user
   */
  createUser(email: string, password: string){
    const authData: AuthData = {
      email:email,
      password: password
    }
    //Give the route to use in backend
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {

      });
  }

  login(email: string, password: string){
    const authData: AuthData = {
      email:email,
      password: password
    }
    this.http.post("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
      });
  }
}
