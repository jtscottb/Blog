import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public showError: boolean = false;
  public form: UntypedFormGroup;
  public loginError = {
    code: '',
    message: ''
  };
  private subs: Subscription[] = [];

  constructor(private router: Router,
              private userService: UserService,
              private fb: UntypedFormBuilder) {
    this.form = this.fb.group({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email
      ]),
      pword: new UntypedFormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach( s => {s.unsubscribe()});
  }

  login() {
    const email: string = this.form.controls['email'].value;
    const password: string = this.form.controls['pword'].value;
    this.userService.login(email, password).then( (isAdmin: boolean) => {
      if(isAdmin) {
        this.showError = false;
        this.router.navigate(['/HOME']);
      }
      else {
        this.showError = true;
        this.loginError = this.userService.error;
      }
    });
  }

}
