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
  categories = [
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

  constructor(private bs: BlogService) { }

  ngOnInit(): void {
    this.bs.latestPost().then( (p: Post) => {
      this.latestPost = p;
    });
    this.getRandomPosts();
  }

  async getRandomPosts() {
    for(var cat of this.categories) {
      var p: Post = await this.bs.randomPost(cat.type);
      if(p != undefined) {
        this.posts.push(p);
      }
    }
  }

}
