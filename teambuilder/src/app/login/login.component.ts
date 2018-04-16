import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from './../shared/user';
import { FeedbackService } from '../services/feedback.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: User;
  formErrors = {
    'username': '',
    'password': ''
  };
  validationMessages = {
    'username': {
      'required': 'Username is required.',
      'minlength': 'Username must be at least 2 characters long.',
      'maxlength': 'Username cannot be more than 25 characters long.'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 2 characters long.',
      'maxlength': 'Password cannot be more than 25 characters long.'
    }
  };

  constructor(private fb: FormBuilder, 
    private feedbackService: FeedbackService, 
    private router: Router,
    private authService: AuthService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.user = this.loginForm.value;
    console.log(this.user);
    this.authService.login(this.user.username, this.user.password).subscribe((res:{Token:string}) => {
      this.authService.token = res.Token;
      this.authService.username = this.user.username;
      this.router.navigate(['/roomlist']);
    });
  }

  createAccount() {
    this.router.navigate(['/register']);
  }
}
