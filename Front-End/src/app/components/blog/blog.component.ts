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
  public categories = [
    {type: 'journal', title: 'Daily Dose'},
    {type: 'finance', title: 'Common Cents'},
    {type: 'hair', title: 'Hair, There, Everywhere'},
    {type: 'cleaning', title: 'Tidy Talk'},
    {type: 'travel', title: 'Pack Your Bags'},
    {type: 'fashion', title: 'Classy Threads'},
    {type: 'cooking', title: 'Herbs and Lemons'},
    {type: 'home', title: 'A Beautiful Mess'},
    {type: 'beauty', title: 'Almost Bare'}
  ]
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
    this.categories.forEach( cat => {
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
    this.blogService.groupSubject.next(post.group);
  }

  addPost() {
    this.router.navigate(['post/new']);
    /* this.router.navigate(['']).then( () => {
      this.router.navigate(['/blog/' + this.type + '/new'])
    }); */
  }

}
