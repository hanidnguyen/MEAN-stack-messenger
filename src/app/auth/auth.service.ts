import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  //authStatus is private. Only return as observable such that
  //only this service can emit and other components only listen.
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
    //If authenticated, navigate to home page.
    //If error, push false to entire app to turn off that spinner.
    this.http
      .post(BACKEND_URL + "/signup", authData)
      .subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: () => {
          this.authStatusListener.next(false);
        }
      });
  }


  /**
   *
   * @param email
   * @param password
   *
   * Request to login. Set timer to logout because token will expire.
   * Update local storage with token and expiration such that user auth state is prolonged after page refresh.
   */
  login(email: string, password: string){
    const authData: AuthData = {
      email:email,
      password: password
    }
    //request to login backend
    this.http.post<{
      token: string,
      expiresIn: number,
      userId: string
    }>(BACKEND_URL + "/login", authData)
      .subscribe({
        next: (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        error: (err) => {
          this.authStatusListener.next(false);
        }
      });
  }
  /**
   * Auto authenticate user when page reloads
   * If expiresIn not yet reached zero, then user is authenticated and emit next to update components.
   * Run in app component
   */
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expireIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  /**
   * Log out function set token and isAuthenticated to null/false
   * Then emit next to update components.
   * Clear token timer and local storage data (has token and expiration) once user logs out.
   */
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  /**
   *
   * @param duration
   * Set timer everytime user logs in
   */
  private setAuthTimer(duration: number){
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  //save token in local storage protected by Angular so user auth state prolongs after website refresh.
  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  /**
   *
   * @returns the local storage items
   *
   * Function to return local storage items if there is any.
   */
  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
