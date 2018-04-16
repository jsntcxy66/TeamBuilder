import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import * as Rx from 'rxjs/Rx';


@Injectable()
export class RoomService {

  roomList: Array<string> = [];
  roomMembers: Array<string> = [];
  currentRoom: string = '';
  create_roomname: string;
  join_roomname: string;
  createRoomSub: Subject<boolean>;
  joinRoomSub: Subject<boolean>;
  messages: Subject<string>;
  roomListSub: Subject<Array<string>>;
  roomMemberSub: Subject<Array<string>>;

  constructor(private chatService: ChatService) {
    this.createRoomSub = new Rx.Subject();
    this.joinRoomSub = new Rx.Subject();
    this.messages = new Rx.Subject();
    this.roomListSub = new Rx.Subject();
    this.roomMemberSub = new Rx.Subject();

    this.chatService.messages.subscribe(msg => {
      let arr = msg.split(':');
      switch(arr[0]) {
        case '01':
          let a;
          [a, ...this.roomList] = arr;
          this.roomListSub.next(this.roomList);
          break;
        case '02':
          this.roomList.push(arr[1]);
          this.roomListSub.next(this.roomList);
          break;
        case '03':
          let temparr1 = [];
          this.roomList.forEach(room => {
            if (room != arr[1]) temparr1.push(room);
          });
          this.roomList = temparr1;
          this.roomListSub.next(this.roomList);
          break;
        case '05':
          if (arr[1] == '0') {
            this.roomMembers.push(arr[2]);
            this.roomMemberSub.next(this.roomMembers);
            this.currentRoom = this.create_roomname;
            this.createRoomSub.next(true);
          } else {
            this.createRoomSub.next(false); 
          }
          break;
        case '07':
          if (arr[1] == '0') {
            let a,b;
            [a,b, ...this.roomMembers] = arr;
            this.roomMemberSub.next(this.roomMembers);
            this.currentRoom = this.join_roomname;
            this.joinRoomSub.next(true);
          } else {
            this.joinRoomSub.next(false);
          }
          break;
        case '08':
          this.roomMembers.push(arr[1]);
          this.roomMemberSub.next(this.roomMembers);
          break;
        case '09':
          let temparr2 = [];
          this.roomMembers.forEach(member => {
            if (member != arr[1]) temparr2.push(member);
          });
          this.roomMembers = temparr2;
          this.roomMemberSub.next(this.roomMembers);
          break;
        case '10':
          this.messages.next(arr[1]+':'+arr[2]);
          break;
      }
    });
   }

  sendToken(Token: string) {
    this.chatService.messages.next('00:' + Token);
  }

  createRoom(username: string, roomname: string) {
    this.chatService.messages.next('04:' + username + ':' + roomname);
    this.create_roomname = roomname;
  }

  joinRoom(username: string, roomname: string) {
    this.chatService.messages.next('06:' + username + ':' + roomname);
    this.join_roomname = roomname;
  }

  sendMessage(username: string, message: string) {
    this.chatService.messages.next('11:' + username + ':' + message);
  }

  leaveRoom(username: string, roomname: string) {
    this.chatService.messages.next('12:' + username + ':' + roomname);
  }
}
