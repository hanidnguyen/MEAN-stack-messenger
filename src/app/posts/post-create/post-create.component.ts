import { Component, OnInit} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";

//import custom mimeType validator
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

/**
 * Template driven form control is in the html.
 * Reactive approach control of form is in here (implement FormGroup and Validators).
 * We use reactive approach to easily post images.
 * Use FormGroup to control how our components do things using the ts file.
 */
//
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;

  //dependency injection
  //also inject activated route to manage how this component will be used for different routes.
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  /**
   * Set up form properties and their validators
   * Use custom validator for image type
   * Subscribe to paramMap (from route) to check if a postId is in paramMap
   * Switch to edit mode if postId is in paramMap, else stay on create mode.
   * Edit mode: update all properties (to show on front-end)
   * Create mode: set postId to null (postId generated from database)
   */
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  /**
   *
   * @param event
   * Hook up image picking from html to ts
   * Tell angular event target is a html input element to access files.
   * User give one file so we take the first one (files[0])
   * Patch (update) and then run validator
   * Specify custom FileReader. onLoad, convert image file to string
   * Call readAsDataUrl to use the custom FileReader.
   */
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Called whenever form is submitted (see html)
   * Supports both create and edit mode.
   */
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
