import { Component } from "@angular/core"
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * Template driven approach to forms, form handling (validation) in the html.
 */
export class LoginComponent{
  isLoading = false;

  constructor(public authService: AuthService){}

  onLogin(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email,form.value.password);
  }
}
