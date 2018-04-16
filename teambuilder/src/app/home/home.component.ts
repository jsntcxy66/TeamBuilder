import { Component, OnInit, Type, OnDestroy } from '@angular/core';
import { UserRes } from '../shared/userRes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';
import { FeedbackService } from '../services/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {

  feedbackForm:FormGroup;
  userRes: UserRes = null;

  errMess: string;

  formErrors = {
    'name':'',
    'skill':''
  }

  validationMessages = {
    'name':{
      'required':'Name is required',
      'minlength': 'Name must be at least 2 characters long',
      'maxlength': 'Name cannot be more than 25 characters long'
    },
    'skill':{
      'required':'Please include at least one skill',
      'minlength': 'Please include at least one skill',
      'maxlength': 'You have included too many skills : )'
    }
  }

  constructor(private fb: FormBuilder, public feedbackserve: FeedbackService, private router:Router) {
    this.createForm();
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.feedbackserve.userRes = this.userRes;
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      name:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      skill:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });
    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm) {return;}
    const form = this.feedbackForm;
    for(const field in this.formErrors){
      this.formErrors[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid){
        const messages = this.validationMessages[field];
        for(const key in control.errors){
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit(){
    let val = this.feedbackForm.value;
    val.skill = String(val.skill).split(',');
    console.log(val);
    this.feedbackserve.submitFeedback(val).subscribe(res => {
      this.userRes = res;
      console.log(this.userRes.room);
      this.router.navigate(['/roomlist',this.userRes.uid]);
    });
    
  }

}