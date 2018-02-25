import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  UserGroup = [
    {
      "name": "Peng Jin",
      "skill": ["a","b"]
    },
    {
      "name": "Xinyi Chen",
      "skill": ["c","d"]
    },
    {
      "name": "Mingyan Chu",
      "skill": ["c","d"]
    },
    {
      "name": "Weiqi Yu",
      "skill": ["c","d"]
    }
  ]

  constructor() { }

  ngOnInit() {
  }
}