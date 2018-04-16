import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';
import { Params, ActivatedRoute } from '@angular/router';

import { RoomService } from '../services/room.service';
import { FeedbackService } from '../services/feedback.service';

import { Room } from '../shared/room';
import { User } from '../shared/user';
import { UserRes } from '../shared/userRes';

@Component({
  selector: 'app-createroom',
  templateUrl: './createroom.component.html',
  styleUrls: ['./createroom.component.scss']
})
export class CreateroomComponent implements OnInit {

  CreateroomForm: FormGroup;
  rname: string;
  formErrors = {
    'rname': '',
  };
  validationMessages = {
    'rname': {
      'required': 'A room name is required.',
      'minlength': 'A room name must be at least 2 characters long.',
      'maxlength': 'A room name cannot be more than 25 characters.'
    }
  };
  user: UserRes;

  constructor(private dialogRef: MatDialogRef<CreateroomComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private roomservice: RoomService,
    public feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
    this.user = this.feedbackService.userRes;
  }

  createForm() {
    this.CreateroomForm = this.fb.group({
      rname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });
    this.CreateroomForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.CreateroomForm) { return; }
    const form = this.CreateroomForm;

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
    // console.log(this.user.uid);
    // this.rname = this.CreateroomForm.value.rname;
    // console.log(this.rname);
    // this.roomservice.createRoom(this.user.uid, this.rname).subscribe(res => console.log(res));
    this.dialogRef.close();
  }
}
