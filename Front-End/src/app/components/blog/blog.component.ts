import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entry } from 'src/app/models/entry';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  type!: string;
  title!: string;
  description!: string;
  content!: string;

  constructor(
    private route: ActivatedRoute,
    private bs: BlogService
  ) { }

  ngOnInit(): void {
    this.blogType();
    this.getEntries();
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

  getEntries() {
    console.log(this.bs.getEntries(this.type));
  }

  addDoc() {
    var doc: Entry = {
      date: new Date(),
      description: this.description,
      content: this.content
    }

    this.bs.createEntry(this.type, doc);
  }

}
