import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import {Request} from '../models/request'
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map} from 'rxjs';
import { serializeError } from 'serialize-error';
import { UserService } from './user.service';
import { User } from '../models/user';
import { AdminServiceService } from './admin-service.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
private requests: Request[] = [];
private requestsUpdated = new Subject<{requests: Request [], requestCount: number}>();
private studentName:string;
private facultyName: string;


  constructor(private http: HttpClient, private userService: UserService, private adminService: AdminServiceService) { }



  getRequests(requestsPerPage: number, currentPage : number){

    
    const queryParams = `?pagesize=${requestsPerPage}&page=${currentPage}`;

  
    this.http
    .get<{message: string, requests: any, maxRequests: number}>("http://localhost:3000/api/requests" + queryParams)
    .pipe(map((requestData)=>{
        return { requests: requestData.requests.map((request: any) => {
           
          return{

            request_id: request._id,
            title: request.title,
            user_id: request.user_id,
            faculty_id: request.faculty_id,
            status: request.status,
            filePath: request.filePath,
            creator: request.creator
          };

       
        }), maxRequests : requestData.maxRequests};

    }))
    .subscribe((transformed_post_data) => {

        this.requests = transformed_post_data.requests;

        for(let i =0; i < this.requests.length; i++){


          this.userService.getUser(this.requests[i].user_id)
          .subscribe(responseData =>{

             this.requests[i].user_id = responseData.l_name + ", "+ responseData.f_name;

          });

          this.userService.getUser(this.requests[i].faculty_id)
          .subscribe(responseData =>{

             this.requests[i].faculty_id = responseData.l_name + ", "+ responseData.f_name;

          });
     
      }
     
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

    
    return this.http.post<{ message:string, _request_: Request }>("http://localhost:3000/api/requests", reqData)
    .pipe(catchError(this.handleError));

  }

  getRequest(id : string){
    return this.http.get<{_id: string, title: string, user_id: string, faculty_id: string, status: string, filePath: string}>("http://localhost:3000/api/requests/" + id);

  }

  deleteRequest(requestId: string){

  return this.http.delete("http://localhost:3000/api/requests/" + requestId)
  .pipe(catchError(this.handleError));

  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
        
    }
    // Return an observable with a user-facing error message.
    const serialized = serializeError(error.error);
    return throwError(() => new Error(serialized.error.message));
  }
   



updateRequest(_id:string, title:string, faculty_id:string, user_id:string, status: string, creator:string,file: string| File){

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
        filePath: file,
        creator: creator
      }

    }
  
    this.http
    .put("http://localhost:3000/api/requests/" + _id, requestData)
    .subscribe(response =>{
      });

  }



}
