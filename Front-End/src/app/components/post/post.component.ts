import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
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
  public filteredPosts!: Post[];
  public searchString: string = '';
  public selectedPost!: Post;
  public posts: Post[] = [];

  public time = new Observable<string>( (observer: Observer<string>) => {
    setInterval( () => observer.next(new Date().toString()), 1000 );
  })
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
    let u = this.session.getIsAdmin().subscribe( value => this.isAdmin = value);
    this.subs = [u];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')?.toString();
    const type = this.route.snapshot.paramMap.get('type')?.toString();
    if(type && id) {
      this.blogService.getPost(type, id).then( (post: Post) => {
        this.selectedPost = post;
        this.getCategoryPosts();
        this.getCategoryTypes();
      });
    }

    /* let p = this.session.getPost().subscribe( (post: Post) => {
      post.date = new Timestamp(post.date.seconds, post.date.nanoseconds);
      this.selectedPost = post;
    }); */

    this.editForm = this.fb.group({
      description: new UntypedFormControl(this.selectedPost.description, Validators.required),
      content: new UntypedFormControl(this.selectedPost.content, Validators.required)
    })
    this.newForm = this.fb.group({
      group: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('', Validators.required),
      content: new UntypedFormControl('', Validators.required)
    })
  }

  ngOnDestroy() {
    this.subs.forEach( s => s.unsubscribe());
  }

  getCategoryPosts() {
    this.blogService.getPosts(this.selectedPost.group).then( (posts: Post[]) => {
      this.posts = posts;
      this.filteredPosts = posts;
    });
  }

  getCategoryTypes() {
    this.blogService.categories.forEach( cat => this.groups.push({type: cat.type, title: cat.title}));
  }

  filterPosts() {
    if(this.searchString != '') {
      this.filteredPosts = this.posts.filter( (post: Post) => {
        return post.description.toLowerCase().includes(this.searchString.toLowerCase());
      });
    } else {
      this.filteredPosts = this.posts;
    }
  }

  back() {
    this.router.navigate(['']);
  }

  submitEdit() {
    this.selectedPost.description = this.editForm.controls['description'].value;
    this.selectedPost.content = this.editForm.controls['content'].value;
    this.blogService.updatePost(this.selectedPost.group, this.selectedPost).then( () => {
      this.session.setPost(this.selectedPost);
    }, (error: any) => {
      console.log(error);
    });
    this.operation = undefined;
    this.getCategoryPosts();
  }

  addDoc() {
    var date: Date = new Date();
    var doc: Post = {
      date: new Timestamp(date.getTime()/1000, date.getMilliseconds()),
      group: this.selectedGroup.type,
      title: this.selectedGroup.title,
      description: this.newForm.controls['description'].value,
      content: this.newForm.controls['content'].value
    }
    this.blogService.createPost(this.selectedGroup.type, doc);
    this.router.navigate(['']).then( () => {
      this.router.navigate(['/blog/' + this.selectedGroup.type]);
    });
    this.operation = undefined;
    this.getCategoryPosts();
  }

  delete() {
    this.blogService.deletePost(this.selectedPost.group, this.selectedPost).then( () => {
      // this.session.setPost(null);
      this.router.navigate(['/blog/' + this.selectedPost.group]);
    }, (error: any) => {
      console.log(error);
    });
    this.getCategoryPosts();
  }

}
