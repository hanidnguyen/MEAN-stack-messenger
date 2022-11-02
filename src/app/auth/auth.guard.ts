/**
 * Guard for routes.
 * Without it, any user can go directly to a /create /edit page.
 */

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}

  /**
   * @param route
   * @param state
   * @returns
   *
   * We can rely on isAuth to be current as it updates if we login or logout.
   * Redirect user to login page when they are not authenticated to reach a specific route.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    if(!isAuth){
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }
}
