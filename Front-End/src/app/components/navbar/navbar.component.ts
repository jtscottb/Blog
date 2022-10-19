import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public nav: string | undefined;
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
  public isAdmin: boolean = false;
  private subs: Subscription[] = [];

  constructor(private router: Router,
              private userService: UserService,
              private session: SessionService,
              private blogService: BlogService) {
    this.nav = 'HOME';
  }

  ngOnInit(): void {
    let a = this.session.isAdmin.subscribe( value => this.isAdmin = value);
    let u = this.router.events.subscribe( event => {
      if(event instanceof NavigationEnd) {
        this.nav = event.url.split('/').find( value => {
          let match: boolean = false;
          if(event.url.split('/').length > 2) {
            for(let cat of this.categories) {
              match = (cat.type == value);
              if(match) {break}
            }
          } else {
            match = (value != '');
          }
          return match;
        });
      }
    });
    this.subs = [a, u];
  }

  ngOnDestroy() {
    this.subs.forEach( s => { s.unsubscribe() });
  }
  
  blogType(type: string) {
    this.blogService.groupSubject.next(type);
    this.router.navigate(['']).then( () => {
        this.router.navigate(['/blog/'+type]);
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['HOME']);
  }

}
