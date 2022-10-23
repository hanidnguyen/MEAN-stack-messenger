import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  //authStatus is private. Only return as observable such that
  //only this service can emit and other component only listen.
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  /**
   *
   * @param email
   * @param password
   *
   * Send request to backend to create a user
   */
  createUser(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    }
    //Give the route to use in backend
    this.http.post<{token:string}>("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        console.log(token);
      });
  }


  /**
   *
   * @param email
   * @param password
   *
   * Request to login. Set timer to logout because token will expire.
   */
  login(email: string, password: string){
    const authData: AuthData = {
      email:email,
      password: password
    }
    //request to login backend
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * Log out function set token and isAuthenticated to null/false
   * Then emit next to update components.
   * Clear token timer once user logs out.
   */
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }
}
