import { Component, OnDestroy, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

/**
 * Template driven approach to forms, form handling (validation) in the html.
 */
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  //dependency inject auth service to use
  constructor(public authService: AuthService){}

  /**
   * Remove spinner when user not authenticated.
   * Get the authStatus from service (boolean) and if status is false, turn off spinner.
   */
  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
