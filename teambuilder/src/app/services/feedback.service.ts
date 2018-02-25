import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseURL';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UserRes } from '../shared/userRes';
@Injectable()
export class FeedbackService {

  public userRes: UserRes;

  constructor(private http:Http) { }

  submitFeedback(feedback: string[]):Observable<UserRes> {
    return this.http.post(baseURL+"new_user",feedback)
        .map((res:Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}