import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  type: string = 'Type';
  post!: Post;
  types: string[] = ['journal', 'finance', 'hair', 'cleaning', 'travel', 'fashion', 'cooking', 'home', 'beauty'];

  constructor(
    private route: Router,
    private ar: ActivatedRoute,
    private bs: BlogService
  ) { }

  ngOnInit(): void {
    this.getPost();
  }

  getPost() {
    this.type = String(this.ar.snapshot.paramMap.get('type'));
    const id = String(this.ar.snapshot.paramMap.get('id'));
    this.post = this.bs.getPost(this.type, id);
  }

  back() {
    this.route.navigate(['/blog/'+this.type]);
  }

}
