import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from './../shared/user';
import { FeedbackService } from '../services/feedback.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from '../roomlist/roomlist.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: User;
  userRes: User;
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
    private authService: AuthService,
    private snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });

    this.registerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;

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
    this.user = this.registerForm.value;
    console.log(this.user);
    this.authService.register(this.user.username, this.user.password).subscribe((res:{Token:string}) => {
      this.authService.token = res.Token;
      this.authService.username = this.user.username;
      this.router.navigate(['/roomlist']);
    },
    err => this.openSnackBar());
    // this.feedbackService.login(this.user).subscribe(res => {
    //   this.userRes = res;
    //   console.log(this.userRes.username);
      
    // });
  }

  openSnackBar() {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 500
    });
  }

}
