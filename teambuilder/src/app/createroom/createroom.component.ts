import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';
import { Params, Router } from '@angular/router';

import { FeedbackService } from '../services/feedback.service';

import { Room } from '../shared/room';
import { User } from '../shared/user';
import { UserRes } from '../shared/userRes';
import { ChatService } from '../chat.service';
import { RoomService } from '../room.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-createroom',
  templateUrl: './createroom.component.html',
  styleUrls: ['./createroom.component.scss']
})
export class CreateroomComponent implements OnInit {

  errflag: boolean = false;
  CreateroomForm: FormGroup;
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

  constructor(private dialogRef: MatDialogRef<CreateroomComponent>,
    private fb: FormBuilder,
    private router: Router,
    private chatService: ChatService,
    private roomService: RoomService,
    private authService: AuthService) {

    this.createForm();

    this.roomService.createRoomSub.subscribe(flag => {
      if (flag == true) this.dialogRef.close(flag);
      else this.errflag = true;
    });
    // this.chatService.messages.subscribe(msg => {
    //   let arr = msg.split(':');
    //   if (arr[0] == '05') {
    //     if (arr[1] == '0') {
    //       this.flag = true;
    //       this.roomService.roomMembers.push(arr[2]);
    //       this.roomService.currentRoom = this.CreateroomForm.value.rname;
    //       this.dialogRef.close(this.flag);
    //     } else {
    //       this.errflag = true;
    //     }
    //   }
    // });
  }

  ngOnInit() {

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
    this.roomService.createRoom(this.authService.username, this.CreateroomForm.value.rname);
    // console.log(this.user.uid);
    // this.rname = this.CreateroomForm.value.rname;
    // console.log(this.rname);
    // this.roomservice.createRoom(this.user.uid, this.rname).subscribe(res => console.log(res));
  }

}
