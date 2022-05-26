import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  nav: string = 'HOME';

  constructor(private route: Router) { }

  ngOnInit(): void {
  }
  
  blogType(type: string) {
    this.route.navigate(['']).then(
      () => {
        this.route.navigate(['/blog/'+type]);
      }
    );
    this.activeTab(type);
  }

  activeTab(tab: string) {
    this.nav = tab;
  }

}
