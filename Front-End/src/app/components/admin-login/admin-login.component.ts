import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  showLogin: boolean = false;
  form: UntypedFormGroup;

  constructor(
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

  login() {
    let user: User = {
      email: this.form.controls['email'].value,
      password: this.form.controls['pword'].value
    }
    this.userService.login(user);
  }

}
