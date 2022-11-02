import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

/**
 * Declare auth routing modules login and signup
 * Imported from Auth.Module
 */

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
]

@NgModule({
  imports: [
    //register some child routes which will be merged with the route router eventually
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {

}
