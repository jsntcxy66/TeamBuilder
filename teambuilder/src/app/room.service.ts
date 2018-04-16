import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';

@Injectable()
export class RoomService {

  roomList: Array<string> = [];
  roomMembers: Array<string> = [];
  currentRoom: string = '';

  constructor(private chatService: ChatService) {
    this.chatService.messages.subscribe(msg => {
      let arr = msg.split(':');
      switch(arr[0]) {
        case '01':
          let a;
          [a, ...this.roomList] = arr;
          break;
        case '02':
          this.roomList.push(arr[1]);
          break;
        case '03':
          let temparr1 = [];
          this.roomList.forEach(room => {
            if (room != arr[1]) temparr1.push(room);
          });
          this.roomList = temparr1;
          break;
        case '08':
          this.roomMembers.push(arr[1]);
          break;
        case '09':
          let temparr2 = [];
          this.roomMembers.forEach(member => {
            if (member != arr[1]) temparr2.push(member);
          });
          this.roomMembers = temparr2;
          break;
      }
    });
   }

  sendToken(Token: string) {
    this.chatService.messages.next('00:' + Token);
  }

  createRoom(username: string, roomname: string) {
    this.chatService.messages.next('04:' + username + ':' + roomname);
  }

  joinRoom(username: string, roomname: string) {
    this.chatService.messages.next('06:' + username + ':' + roomname);
  }

  sendMessage(username: string, message: string) {
    this.chatService.messages.next('11:' + username + ':' + message);
  }

  leaveRoom(username: string, roomname: string) {
    this.chatService.messages.next('12:' + username + ':' + roomname);
  }
}
