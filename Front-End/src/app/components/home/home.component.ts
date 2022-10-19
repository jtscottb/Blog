import { Component, OnInit } from '@angular/core';
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
  public latestPost!: Post;
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

  constructor(private blogService: BlogService,
              private session: SessionService) { }

  ngOnInit(): void {
    this.blogService.latestPost().then( (p: Post) => {
      this.latestPost = p;
    });
    this.getRandomPosts();
  }

  async getRandomPosts() {
    for(var cat of this.categories) {
      var p: Post = await this.blogService.randomPost(cat.type);
      if(p != undefined) {
        this.posts.push(p);
      }
    }
  }

  setPost(post: Post) {
    post = this.blogService.transformPost(post);
    this.session.setPost(post);
  }

}
