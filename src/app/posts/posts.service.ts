import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * @param postsPerPage
   * @param currentPage
   *
   * Pass query parameters to match with html.get in backend : name check is important
   * QueryParams syntax with backtick: dynamic value injection.
  */
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>("http://localhost:3000/api/posts" + queryParams)
      .pipe(
        //map the post array
        map(postData => {
          return { //map each post properties, also update maxPosts
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      //update data in front-end
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  /**
   * @returns postsUpdated subject as an observable for other components to subscribe.
   */
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  /**
   * @param id
   *
   * @returns a post object with given id from backend (defined in backend/models/post)
   */
  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  /**
   * @param title
   * @param content
   * @param image
   *
   * Compile a new postData type FormData to send to backend
   * Recieve a message and post as result of http response
   * and send to backend: url and postData
   * Subscribe to navigate to posts list after http process is finished
   */
    addPost(title: string, content: string, image: File) {
      const postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title); //pass title as part of filename
      this.http
        .post<{ message: string; post: Post }>(
          "http://localhost:3000/api/posts",
          postData
        )
        .subscribe(responseData => {
          this.router.navigate(["/"]);
        });
    }

    /**
     *
     * @param id
     * @param title
     * @param content
     * @param image
     *
     * Edit an existing post then call put request to patch in database
     */
    updatePost(id: string, title: string, content: string, image: File | string) {
      let postData: Post | FormData;
      if (typeof image === "object") {
        postData = new FormData();
        postData.append("id", id);
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
      } else {
        postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image
        };
      }
      this.http
        .put("http://localhost:3000/api/posts/" + id, postData)
        .subscribe(response => {
          this.router.navigate(["/"]);
        });
    }

    /**
     *
     * @param postId
     * @returns a console message from backend: successfully deleted post
     */
    deletePost(postId: string) {
      return this.http
        .delete("http://localhost:3000/api/posts/" + postId);
    }
}
