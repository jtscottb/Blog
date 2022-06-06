import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  type!: string;
  title!: string;
  DOCS!: Post[];
  description!: string;
  content!: string;

  constructor(
    private r: Router,
    private route: ActivatedRoute,
    private bs: BlogService
  ) { }

  ngOnInit(): void {
    this.blogType();
    this.getPosts();
  }

  blogType() {
    this.type = String(this.route.snapshot.paramMap.get('type'));
    switch(this.type) {
      case 'journal':
        this.title = 'Daily Dose | Journal';
        break;
      case 'finance':
        this.title = 'Common Cents | Budgeting and Finance';
        break;
      case 'hair':
        this.title = 'Hair, There, Everywhere | Hair Care';
        break;
      case 'cleaning':
        this.title = 'Tidy Talk | Cleaning';
        break;
      case 'travel':
        this.title = 'Pack Your Bags | Travel';
        break;
      case 'fashion':
        this.title = 'Classy Threads | Fashion';
        break;
      case 'cooking':
        this.title = 'Herbs and Lemons | Cooking';
        break;
      case 'home':
        this.title = 'A Beautiful Mess | Home Design';
        break;
      case 'beauty':
        this.title = 'Almost Bare | Beauty';
        break;
    }
  }

  async getPosts() {
    this.DOCS = await this.bs.getPosts(this.type);
  }

  addDoc() {
    var date: Date = new Date();
    var doc: Post = {
      date: new Timestamp(date.getTime()/1000, date.getMilliseconds()),
      group: this.type,
      description: this.description,
      content: this.content
    }
    this.bs.createPost(this.type, doc);
    this.r.navigate(['']).then( () => {
      this.r.navigate(['/blog/'+this.type]);
    });
  }

}
