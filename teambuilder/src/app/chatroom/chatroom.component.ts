import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { RoomService } from '../room.service';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  rname: string;
  avatars: Array<string> = ["../../assets/images/p1.bmp", "../../assets/images/p2.bmp", "../../assets/images/p3.bmp", "../../assets/images/p4.bmp", "../../assets/images/p5.bmp", "../../assets/images/p6.bmp"];;
  // UserGroup = [
  //   {
  //     "name": "Peng Jin"
  //   },
  //   {
  //     "name": "Xinyi Chen"
  //   },
  //   {
  //     "name": "Mingyan Chu"
  //   },
  //   {
  //     "name": "Weiqi Yu"
  //   }
  // ];
  usernames: Array<string>;

  messages: Array<string> = [
    // "Xinyi: Hello!",
    // "Peng: Hello!",
    // "Weiqi: Hi everyone~",
    // "Mingyan: Nice to meet you guys!",
    // "Xinyi: I'm from China.",
    // "Weiqi: Me too."
  ];
  sendmessage: string;

  constructor(private roomService: RoomService,
    private chatService: ChatService,
    private authService: AuthService,
    private route: Router) {
      this.rname = this.roomService.currentRoom;
      this.usernames = this.roomService.roomMembers;

      this.roomService.roomMemberSub.subscribe(roommember => {
        this.usernames = roommember;
      });
      this.roomService.messages.subscribe(msg => {
        console.log("should have msg");
        console.log(msg);
        if (msg) this.messages.push(msg);
      });
      // this.chatService.messages.subscribe(msg => {
      //   let arr = msg.split(':');
      //   if (arr[0] == '10')
      //     this.messages.push(arr[1]+':'+arr[2]);
      // });
     }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.roomService.leaveRoom(this.authService.username, this.roomService.currentRoom);
  }

  onSubmit() {
    console.log(this.sendmessage);
    this.roomService.sendMessage(this.authService.username, this.sendmessage);
    document.getElementById('scrollbottom').scrollIntoView({
      behavior: 'smooth'
    });
  }

  onLeave() {
    this.roomService.leaveRoom(this.authService.username, this.roomService.currentRoom);
    this.route.navigate(["/roomlist"]);
  }

}