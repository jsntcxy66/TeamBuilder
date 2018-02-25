import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Room } from '../shared/room';
import { Observable } from 'rxjs/Observable';
import { baseURL } from '../shared/baseurl';

import 'rxjs/add/operator/map';

@Injectable()
export class RoomService {

  rooms: Room[];

  constructor(private http: Http) { }

//  getRooms(): Observable<Room[]> {
//    return this.http.get(baseURL + 'roomlist')
//                    .map(res => { return res.json(); });

  createRoom(uid: number, rname: string): Observable<number> {
    return this.http.post('http://localhost:3000/api/new_room', {"uid":uid, "rname":rname})
      .map((res:Response) => res.json());
  }

  joinRoom(uid: number, rid:number):Observable<any>{
    return this.http.post('http://localhost:3000/api/enter_room', {"uid":uid, "rid":rid})
      .map((res:Response) => res.json());
  }

}
