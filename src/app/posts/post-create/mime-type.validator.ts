import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

//there is no built-in file type validator so we write our own.
//get form control as argument either type promise or observable.
//[] is not an array, just shows this is a dynamic property doesn't matter the name.
//Since we return a promise/observable, we write our own observable to convert file reader to an observable.
export const mimeType = (
  control: AbstractControl
): Promise<{[key: string]: any}> | Observable<{[key: string]: any}>  => { //return value types
  const file = control.value as File;
  const fileReader = new FileReader();
  //generic type observer same as input observer.
  const frObs = new Observable((observer: Observer<{[key: string]: any}>) => {
    //equivalent to filereader.onLoadEnd()
    fileReader.addEventListener("loadend", () => {
      //Uint8Array: 8 bit unsigned integers for accessing patterns of file metadata
      //such that we can parse the mime type and validate.
      //subarray(0,4) gives us the mime type
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
      //build header string of hexadecimal values
      let header = "";
      let isValid = false;
      for (let i = 0; i < arr.length; i++){
        header += arr[i].toString(16);
      }
      //the different file types' codes
      switch (header) {
        case "89504e47": //png
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8": //jpeg
          isValid = true;
          break;
        default: //type unknown
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      //emit result
      if(isValid){
        observer.next(null); //valid is null
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    //start the eventlistener emit process, makes it easy for us to use Uint8Array
    fileReader.readAsArrayBuffer(file);
  });
  //return the filereader observable
  return frObs;
};
