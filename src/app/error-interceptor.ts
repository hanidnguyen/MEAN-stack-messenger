import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";

/**
 * Interceptor to catch HTTP errors in any http request stream.
 * Return a newly generated observable with that error for posts service to use: return throwError();
 */

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  //Inject the mat dialog for error popup display
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        //Set default message, override default if there is a valid error message.
        let errorMessage = "An unknown error occurred!";
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        //Activate the popup Error Component together with the generated errorMessage.
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(() => error);
      })
    );
  }
}
