import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

/**
 * Declare routing modules
 * Register all routes and corresponding components here
 * Also make AuthGuard available for use
 * Attach canActivate AuthGuard to routes that needs authentication.
 * '' => root page path
 * 'create' => localhost:4200/create
 * : => extract id dynamically
 *
 * lazy load login and signup components through loadChildren (see auth module and auth routing module)
 */
const routes: Routes = [
  { path: '' , component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {

}
