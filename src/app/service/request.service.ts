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
private requestsUpdated = new Subject<{requests: Request [], requestCount: number}>();

  constructor(private http: HttpClient) { }


  getRequests(requestsPerPage: number, currentPage : number){

    
    const queryParams = `?pagesize=${requestsPerPage}&page=${currentPage}`;

    this.http
    .get<{message: string, requests: any, maxRequests: number}>("http://localhost:3000/api/requests" + queryParams)
    .pipe(map((requestData)=>{
        return { requests: requestData.requests.map((request: any) => {
          return{

            request_id: request._id,
            title: request.title,
            user_id:request.user_id,
            faculty_id:request.faculty_id,
            status: request.status,
            filePath: request.filePath
          };
        }), maxRequests : requestData.maxRequests};

    }))
    .subscribe((transformed_post_data) => {
        this.requests = transformed_post_data.requests;

        this.requestsUpdated.next({
          requests : [...this.requests],
          requestCount: transformed_post_data.maxRequests
        });
    });

  }

  getRequestUpdateListener(){
    return this.requestsUpdated.asObservable();
  }

  addRequest(title: string, user_id: string, faculty_id: string, status: string, file:File){

    let filename;
    if(!file){
      filename = "";
    }
    else{
      filename = file.name;
    }

    const reqData = new FormData();
    reqData.append("title" , title);
    reqData.append("user_id" , user_id);
    reqData.append("faculty_id" , faculty_id);
    reqData.append("status" , status);
    reqData.append("file" , file, filename);

    
    this.http.post<{ message:string, _request_: Request }>("http://localhost:3000/api/requests", reqData)
      .subscribe( (responseData) => {
         
       
      });

  }

  getRequest(id : string){
    return this.http.get<{_id: string, title: string, user_id: string, faculty_id: string, status: string, filePath: string}>("http://localhost:3000/api/requests/" + id);

  }

  deleteRequest(requestId: string){

  return this.http.delete("http://localhost:3000/api/requests/" + requestId);

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
      });

  }



}
