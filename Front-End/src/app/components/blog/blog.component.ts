import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  type!: string;
  title!: string;
  DOCS!: Post[];
  public isAdmin: boolean = false;
  
  private subs: Subscription[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private blogService: BlogService,
              private session: SessionService) {
    let u = this.session.isAdmin.subscribe( value => this.isAdmin = value);
    this.subs = [u];
  }

  ngOnInit(): void {
    this.blogType();
    this.getPosts();
  }

  ngOnDestroy() {
    this.subs.forEach( s => s.unsubscribe());
  }

  blogType() {
    this.type = String(this.route.snapshot.paramMap.get('type'));
    this.blogService.categories.forEach( cat => {
      if(this.type == cat.type) {
        this.title = cat.title;
      }
    });
  }

  async getPosts() {
    this.DOCS = await this.blogService.getPosts(this.type);
    this.DOCS.forEach( doc => {
      doc.title = this.title;
    });
  }

  setPost(post: Post) {
    this.session.setPost(post);
  }

  addPost() {
    this.router.navigate(['post/new']);
  }

}
