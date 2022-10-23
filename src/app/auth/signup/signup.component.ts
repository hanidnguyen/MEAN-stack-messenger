import { Component } from "@angular/core"
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

/**
 * Template driven approach to forms, form handling (validation) in the html.
 */
export class SignupComponent{
  isLoading = false;

  //dependency inject auth service to use
  constructor(public authService: AuthService){}

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
