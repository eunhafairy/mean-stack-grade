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
        return requestData.requests.map((request: any) => {
          return{

            request_id: request._id,
            title: request.title,
            user_id:request.user_id,
            faculty_id:request.faculty_id,
            status: request.status,
            filePath: request.filePath
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

  addRequest(title: string, user_id: string, faculty_id: string, status: string, file:File){

    const reqData = new FormData();
    reqData.append("title" , title);
    reqData.append("user_id" , user_id);
    reqData.append("faculty_id" , faculty_id);
    reqData.append("status" , status);
    reqData.append("file" , file, file.name as string);

    
    this.http.post<{ message:string, _request_: Request }>("http://localhost:3000/api/requests", reqData)
      .subscribe( (responseData) => {
         
          const _request : Request = {
            request_id : responseData._request_.request_id, 
            title : title, 
            user_id: user_id,  
            faculty_id:faculty_id, 
            status: status,
            filePath: responseData._request_.filePath } ;
          
          console.log(responseData.message);
          this.requests.push(_request);
          this.requestsUpdated.next([...this.requests]);
      });

  }

  getRequest(id : string){
    return this.http.get<{_id: string; title: string; user_id: string; faculty_id: string; status: string, filePath: string}>("http://localhost:3000/api/requests/" + id);

  }

  deleteRequest(requestId: string){

    this.http.delete("http://localhost:3000/api/requests/" + requestId)
    .subscribe(() => {

        const updatedRequest = this.requests.filter(request =>request.request_id !== requestId);
        this.requests = updatedRequest;
        this.requestsUpdated.next([...this.requests]);

    });

  }

  updateRequest(_id:string, title:string, faculty_id:string, user_id:string, status: string, file: string| File){

    let requestData : Request | FormData;
    if(typeof(file) === 'object'){
     
    requestData = new FormData();
    requestData.append("request_id",_id);
     requestData.append("title",title);
     requestData.append("faculty_id",faculty_id);
     requestData.append("user_id",user_id);
     requestData.append("status",status);
     requestData.append("file",file, file.name);

    }
    else{

       requestData = {
        request_id: _id,
        title: title,
        faculty_id: faculty_id,
        user_id: user_id,
        status: status,
        filePath: file
      }

    }
  
    this.http
    .put("http://localhost:3000/api/requests/" + _id, requestData)
    .subscribe(response =>{

    const updatedRequests = [...this.requests];
    const oldRequestIndex = updatedRequests.findIndex(p=> p.request_id === _id);
    const _request : Request = { 
      request_id: _id, 
      title: title,
      faculty_id: faculty_id,
      user_id: user_id,
      status: status,
      filePath: "response.filePath"
    };
    updatedRequests[oldRequestIndex] = _request;
    this.requests = updatedRequests;
    this.requestsUpdated.next([...this.requests])

    });

  }



}
