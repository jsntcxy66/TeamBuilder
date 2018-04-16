import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Params, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';

import { User } from '../shared/user';
import { Room } from '../shared/room';
import { RoomService } from '../services/room.service';
import { CreateroomComponent } from '../createroom/createroom.component';
import { baseURL } from '../shared/baseurl';
import { UserRes } from '../shared/userRes';
import { FeedbackService } from '../services/feedback.service';


@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.scss']
})
export class RoomlistComponent implements OnInit {

  avatars : Array<string> = ["../../assets/images/1.png", "../../assets/images/2.png", "../../assets/images/3.png", "../../assets/images/4.png", "../../assets/images/5.png", "../../assets/images/6.png"];
  socket: any;
  user = {
    "username": "mat"
  };

  numofpeople: number;
  rooms = [{
    "rid": 1,
    "rname": "Come On!",
    "current_num": 1,
    "total_num": 3,
    "skills": ["a","b","c"],
  },
  {
    "rid": 10,
    "rname": "Come On!!",
    "current_num": 2,
    "total_num": 3,
    "skills": ["d","e","f"],
  }
  ];
  listroom: Room[];
  userRes: UserRes;

  constructor(private roomservice: RoomService, private dialog: MatDialog,
    private route: ActivatedRoute, private feedbackService: FeedbackService) {
   // this.roomservice.getRooms().subscribe(rooms => this.rooms = rooms);
  }

  ngOnInit() {
    // this.userRes = this.feedbackService.userRes;
    // this.listroom = this.userRes.room;
    // console.log(this.userRes);
    // let uid = +this.route.snapshot.params['uid'];

    // this.socket = io("http://localhost:3000/");

    // this.socket.on('all_room', (data) => {
    //   console.log('all_room');
    //   this.listroom = data;
    //   console.log(data); //will this work?
    // });
    //this.listroom = this.rooms;
  }

  openCreateroomForm() {
    this.dialog.open(CreateroomComponent, { width: '500px', height: '450px' });
  }
}
