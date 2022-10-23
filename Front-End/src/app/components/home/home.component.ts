import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public posts: Post[] = [];
  public randPost!: Post;
  public latestPosts!: Post[];
  public categories: any[] = []
  public subs: Subscription[] = [];

  constructor(private blogService: BlogService,
              private session: SessionService) { }

  ngOnInit(): void {
    let p = this.blogService.getLatestPosts().subscribe( (posts: Post[]) => {
      this.latestPosts = posts;
    });
    this.subs.push(p);
  }

  ngOnDestroy() {
    this.subs.forEach( s => s.unsubscribe());
  }

  setPost(post: Post) {
    this.session.setPost(post);
  }

}
