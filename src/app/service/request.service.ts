import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Request} from '../models/request'
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
private requests: Request[] = [];
private requestsUpdated = new Subject<Request []>();

  constructor(private http: HttpClient) { }


  getRequests(){

    this.http
    .get<{message: string, requests: any}>("http://localhost:3000/api/requests")
    .pipe(map((requestData)=>{
        return requestData.requests.map((request: { _id: any; title: any; user_id: any; faculty_id: any; status: any; }) => {
          return{

            request_id: request._id,
            title: request.title,
            user_id:request.user_id,
            faculty_id:request.faculty_id,
            status: request.status,

          }
        })

    }))
    .subscribe((transformed_post) => {
        this.requests = transformed_post;
        this.requestsUpdated.next([...this.requests]);
    });

  }

  getRequestUpdateListener(){
    return this.requestsUpdated.asObservable();
  }

  addRequest(title: string, user_id: string, faculty_id: string, status: string){

    const _request : Request = {request_id : '', title : title, user_id: user_id,  faculty_id:faculty_id, status: status} ;
    
    this.http.post<{ message:string }>("http://localhost:3000/api/requests", _request)
      .subscribe( (responseData) => {
          console.log(responseData.message);
          this.requests.push(_request);
          this.requestsUpdated.next([...this.requests]);
      });

  }

  deleteRequest(requestId: string){

    this.http.delete("http://localhost:3000/api/requests/" + requestId)
    .subscribe(() => {

        const updatedRequest = this.requests.filter(request =>request.request_id !== requestId);
        this.requests = updatedRequest;
        this.requestsUpdated.next([...this.requests]);

    });

  }



}
