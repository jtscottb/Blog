import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { BlogComponent } from './components/blog/blog.component';
import { HomeComponent } from './components/home/home.component';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  { path: 'courtney', component: AdminLoginComponent },
  { path: 'HOME', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog/:type', component: BlogComponent },
  { path: 'post', component: PostComponent,
      children: [
        { path: 'new', component: PostComponent }
      ]
  },
  { path: '', redirectTo: '/HOME', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
