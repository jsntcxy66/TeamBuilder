import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';

const CHAT_URL = 'ws://localhost:3000/websocket';

@Injectable()
export class ChatService {

  public messages: Subject<string>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<string>>wsService
      .connect(CHAT_URL)
      .map((response: MessageEvent): string => {
        return response.data;
      });
  }
}

