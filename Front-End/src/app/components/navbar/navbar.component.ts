import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  home: string = 'active';
  about: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  activeTab(tab: string) {
    switch (tab) {
      case 'home':
        this.home = 'active';
        this.about = '';
        break;
      case 'about':
        this.about = 'active';
        this.home = '';
        break;
      default:
        this.home = '';
        this.about = '';
    }
  }
}
