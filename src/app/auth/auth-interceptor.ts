import { HttpInterceptor, HttpRequest, HttpHandler} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";


/**
 * Interceptor service for Http client
 * Provide service in app module
 * Intercept on <any> outgoing HttpRequest
 * Intercept next behaves like an observable, such that we can return next to allow other components to continue to subscribe
 * Inject one service to another with empty @Injectable and constructor.
 * Clone request attach token to a header.
 * Name Authorization should match backend check-auth header (case insensitive).
 * Token convention: 'Bearer ' + 'some-token'
 */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
