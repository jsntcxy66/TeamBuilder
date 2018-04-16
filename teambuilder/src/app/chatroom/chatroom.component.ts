import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  rname: string = "ruo ji";
  avatars: Array<string> = ["../../assets/images/p1.bmp", "../../assets/images/p2.bmp", "../../assets/images/p3.bmp", "../../assets/images/p4.bmp", "../../assets/images/p5.bmp", "../../assets/images/p6.bmp"];;
  UserGroup = [
    {
      "name": "Peng Jin"
    },
    {
      "name": "Xinyi Chen"
    },
    {
      "name": "Mingyan Chu"
    },
    {
      "name": "Weiqi Yu"
    }
  ];

  messages: Array<string> = [
    "Xinyi: Hello!",
    "Peng: Hello!",
    "Weiqi: Hi everyone~",
    "Mingyan: Nice to meet you guys!",
    "Xinyi: I'm from China.",
    "Weiqi: Me too."
  ];
  sendmessage: string;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.sendmessage);
    document.getElementById('scrollbottom').scrollIntoView({
      behavior: 'smooth'
    });
    if (this.sendmessage)
      this.messages.push(this.sendmessage);
  }

}