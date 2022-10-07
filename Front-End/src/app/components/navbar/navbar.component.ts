import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  nav: string = 'HOME';
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
  showLogin: boolean = false;
  form: FormGroup;

  constructor(
    private route: Router,
    private userService: UserService,
    private fb: FormBuilder) {
      this.form = this.fb.group({
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        pword: new FormControl('', Validators.required)
      });
    }

  ngOnInit(): void {
  }
  
  blogType(type: string) {
    this.route.navigate(['']).then( () => {
        this.route.navigate(['/blog/'+type]);
    });
    this.activeTab(type);
  }

  activeTab(tab: string) {
    this.nav = tab;
  }

  login() {
    let user: User = {
      email: this.form.controls['email'].value,
      password: this.form.controls['pword'].value
    }
    this.userService.login(user);
  }

}
