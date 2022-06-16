import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  u!: User;

  constructor() { }

  ngOnInit(): void {
  }

}
