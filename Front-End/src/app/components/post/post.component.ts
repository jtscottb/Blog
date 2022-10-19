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
  public type!: string;
  // public title!: string;
  public post!: Post;

  public description: string = '';
  public content: string = '';

  public operation: string | null = null;
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
  editForm!: UntypedFormGroup;
  newForm!: UntypedFormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private blogService: BlogService,
              private session: SessionService,
              private fb: UntypedFormBuilder) {
    let u = this.session.isAdmin.subscribe( value => this.isAdmin = value);
    let g = this.blogService.group.subscribe( group => this.type = group );
    this.subs = [u, g];
  }

  ngOnInit(): void {
    // this.type = String(this.route.snapshot.paramMap.get('type'));
    // const id = String(this.route.snapshot.paramMap.get('id'));
    // this.post = this.blogService.getPost(this.type, id);

    this.session.getPost().subscribe( (post: Post) => {
      post.date = new Timestamp(post.date.seconds, post.date.nanoseconds);
      this.post = post;
    });

    let a = this.router.events.subscribe( event => {
      if(event instanceof NavigationEnd) {
        this.operation = event.url.split('/')[-1] == 'new' ? 'new' : null;
      }
    });

    this.editForm = this.fb.group({
      description: new UntypedFormControl(this.post.description, Validators.required),
      content: new UntypedFormControl(this.post.content, Validators.required)
    })
    this.newForm = this.fb.group({
      description: new UntypedFormControl('', Validators.required),
      content: new UntypedFormControl('', Validators.required)
    })
    this.subs.push(a);
  }

  back() {
    this.router.navigate(['/blog/' + this.post.group], { relativeTo: this.route });
  }

  submitEdit() {
    this.post.description = this.editForm.controls['description'].value;
    this.post.content = this.editForm.controls['content'].value;
    this.blogService.updatePost(this.post.group, this.post);
    this.operation = null;
  }

  addDoc() {
    var date: Date = new Date();
    var doc: Post = {
      date: new Timestamp(date.getTime()/1000, date.getMilliseconds()),
      group: this.type,
      description: this.newForm.controls['description'].value,
      content: this.newForm.controls['content'].value
    }
    this.blogService.createPost(this.type, doc);
    this.router.navigate(['']).then( () => {
      this.router.navigate(['/blog/' + this.type]);
    });
    this.operation = null;
  }

  delete() {
    this.blogService.deletePost(this.post.group, this.post);
  }

}
