import { Component} from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostsService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";

  //dependency injection
  //also inject activated route to manage how this component will be used for different routes.
  constructor(public postsService: PostsService){}

  onAddPost(form: NgForm) {
    if(form.invalid) {return;}

    this.postsService.addPost(form.value.title,form.value.content);
    form.resetForm();
  }
}
