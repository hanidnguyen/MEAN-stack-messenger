import { Component, Inject } from "@angular/core"
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

/**
 * Inject the dialog message into this component.
 * A special way of injecting data into this component due to the special way it is created.
 */

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}){}
}
