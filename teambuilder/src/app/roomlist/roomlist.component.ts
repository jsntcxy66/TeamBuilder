import { Component, OnInit } from '@angular/core';
import { MatCardModule, MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Params, ActivatedRoute, Router } from '@angular/router';
import * as io from 'socket.io-client';

import { User } from '../shared/user';
import { Room } from '../shared/room';
import { CreateroomComponent } from '../createroom/createroom.component';
import { baseURL } from '../shared/baseurl';
import { UserRes } from '../shared/userRes';
import { FeedbackService } from '../services/feedback.service';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';
import { RoomService } from '../room.service';


@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.scss']
})
export class RoomlistComponent implements OnInit {

  avatars: Array<string> = ["../../assets/images/1.png", "../../assets/images/2.png", "../../assets/images/3.png", "../../assets/images/4.png", "../../assets/images/5.png", "../../assets/images/6.png"];
  socket: any;
  rooms = ["Come On!", "Come on!!"];
  roomname: string;

  constructor(
    private dialog: MatDialog,
    private chatService: ChatService,
    private authService: AuthService,
    private roomService: RoomService,
    private router: Router,
    private snackBar: MatSnackBar) {

    console.log('new message from client to websocket: ');
    this.chatService.messages.next('00:' + this.authService.token);
    this.rooms = this.roomService.roomList;
    this.chatService.messages.subscribe(msg => {
      let arr = msg.split(':');
      if (arr[0] == '07') {
        if (arr[1] == '0') {
          let a,b;
          [a,b, ...this.roomService.roomMembers] = arr;
          this.roomService.currentRoom = this.roomname;
          this.router.navigate(['/room']);
        } else {
          this.openSnackBar();
        }
      }
    });
  }

  ngOnInit() {

  }

  onSubmit(room) {
    this.roomname = room;
    this.roomService.joinRoom(this.authService.username, room);
  }

  openCreateroomForm() {
    let dialogRef = this.dialog.open(CreateroomComponent, { width: '500px', height: '450px' });
    dialogRef.afterClosed().subscribe((flag:boolean) => {
      console.log("This is after close");
      if (flag == true) {
        console.log("If this show, flag = true");
        this.router.navigate(['/room']);
      }
        
    });
  }

  openSnackBar() {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 500
    });
  }
}

@Component({
  selector: 'app-snackbar',
  template: `<span>Join in failed!</span>`
})
export class SnackbarComponent {}

