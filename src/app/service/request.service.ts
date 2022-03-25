import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Request} from '../models/request'

@Injectable({
  providedIn: 'root'
})
export class RequestService {
private requests: Request[] = [];
private requestsUpdated = new Subject<Request []>();

  constructor() { }


  getRequests(){

    return [...this.requests];
  }

  getRequestUpdateListener(){
    return this.requestsUpdated.asObservable();
  }

  addRequest(request_id: string, title: string, user_id: string, faculty_id: string, status: string,){

    const request : Request = {
      request_id:request_id,
      title : title,
      user_id: user_id,
      faculty_id:faculty_id,
      status: status}

      this.requests.push(request);
      this.requestsUpdated.next([...this.requests]);
  }

}
