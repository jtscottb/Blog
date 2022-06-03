import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /* post: Post = {
    date: new Timestamp(new Date('May 7, 2022 10:45:00').getTime()/1000, 0),
    description: 'default',
    content: 'default'
  }; */
  post!: Post;
  types: string[] = ['journal', 'finance', 'hair', 'cleaning', 'travel', 'fashion', 'cooking', 'home', 'beauty'];

  constructor(private bs: BlogService) { }

  ngOnInit(): void {
    // this.post = this.bs.randomPost();
    this.bs.randomPost().then( (p: Post) => {
      this.post = p;
    });
  }

}
