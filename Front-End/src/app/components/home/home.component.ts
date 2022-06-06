import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  randPost!: Post;
  latestPost!: Post;
  types: string[] = ['journal', 'finance', 'hair', 'cleaning', 'travel', 'fashion', 'cooking', 'home', 'beauty'];

  constructor(private bs: BlogService) { }

  ngOnInit(): void {
    this.bs.latestPost().then( (p: Post) => {
      this.latestPost = p;
    });
    this.getRandomPosts();
  }

  async getRandomPosts() {
    for(var t of this.types) {
      var p: Post = await this.bs.randomPost(t);
      if(p != undefined) {
        this.posts.push(p);
      }
    }
  }

}
