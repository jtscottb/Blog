import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { SessionService } from 'src/app/services/session.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  public groups: any[] = [];
  public selectedGroup = {
    type: '',
    title: ''
  };
  public post!: Post;

  public description: string = '';
  public content: string = '';

  public operation: string | undefined = undefined;
  public isAdmin: boolean = false;

  private subs: Subscription[];
  editForm!: UntypedFormGroup;
  newForm!: UntypedFormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private blogService: BlogService,
              private session: SessionService,
              private fb: UntypedFormBuilder) {
    let u = this.session.isAdmin.subscribe( value => this.isAdmin = value);
    this.subs = [u];
  }

  ngOnInit(): void {
    let p = this.session.getPost().subscribe( (post: Post) => {
      post.date = new Timestamp(post.date.seconds, post.date.nanoseconds);
      this.post = post;
    });
    this.operation = this.router.url.split('/').find( val => val == 'new');
    this.getCategoryTypes();

    this.editForm = this.fb.group({
      description: new UntypedFormControl(this.post.description, Validators.required),
      content: new UntypedFormControl(this.post.content, Validators.required)
    })
    this.newForm = this.fb.group({
      group: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('', Validators.required),
      content: new UntypedFormControl('', Validators.required)
    })
    this.subs.push(p);
  }

  ngOnDestroy() {
    this.subs.forEach( s => s.unsubscribe());
  }

  getCategoryTypes() {
    this.blogService.categories.forEach( cat => this.groups.push({type: cat.type, title: cat.title}));
  }

  back() {
    this.router.navigate(['/blog/' + this.post.group]);
  }

  submitEdit() {
    this.post.description = this.editForm.controls['description'].value;
    this.post.content = this.editForm.controls['content'].value;
    this.blogService.updatePost(this.post.group, this.post).then( () => {
      this.session.setPost(this.post);
    }, (error: any) => {
      console.log(error);
    });
    this.operation = undefined;
  }

  addDoc() {
    var date: Date = new Date();
    var doc: Post = {
      date: new Timestamp(date.getTime()/1000, date.getMilliseconds()),
      group: this.selectedGroup.type,
      description: this.newForm.controls['description'].value,
      content: this.newForm.controls['content'].value
    }
    this.blogService.createPost(this.selectedGroup.type, doc);
    this.router.navigate(['']).then( () => {
      this.router.navigate(['/blog/' + this.selectedGroup.type]);
    });
    this.operation = undefined;
  }

  delete() {
    this.blogService.deletePost(this.post.group, this.post).then( () => {
      // this.session.setPost(null);
      this.router.navigate(['/blog/' + this.post.group]);
    }, (error: any) => {
      console.log(error);
    });
  }

}
