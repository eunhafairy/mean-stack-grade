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
    
    this.http.post<{ message:string, reqId: string }>("http://localhost:3000/api/requests", _request)
      .subscribe( (responseData) => {
          const id = responseData.reqId;
          _request.request_id = id;
          console.log(responseData.message);
          this.requests.push(_request);
          this.requestsUpdated.next([...this.requests]);
      });

  }

  getRequest(id : string){
    return this.http.get<{_id: string; title: string; user_id: string; faculty_id: string; status: string}>("http://localhost:3000/api/requests/" + id);

  }

  deleteRequest(requestId: string){

    this.http.delete("http://localhost:3000/api/requests/" + requestId)
    .subscribe(() => {

        const updatedRequest = this.requests.filter(request =>request.request_id !== requestId);
        this.requests = updatedRequest;
        this.requestsUpdated.next([...this.requests]);

    });

  }

  updateRequest(_id:string, title:string, faculty_id:string, user_id:string, status: string){

    const _request : Request = { request_id: _id, title: title, faculty_id: faculty_id, user_id: user_id, status: status };
    this.http.put("http://localhost:3000/api/requests/" + _id, _request)
    .subscribe(response =>{

    const updatedRequests = [...this.requests];
    const oldRequestIndex = updatedRequests.findIndex(p=> p.request_id === _request.request_id);
    updatedRequests[oldRequestIndex] = _request;
    this.requests = updatedRequests;
    this.requestsUpdated.next([...this.requests])

    });

  }



}
