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



  getRequests(){

    this.http
    .get<{message: string, requests: any, maxRequests: number}>("http://localhost:3000/api/requests")
    .pipe(map((requestData)=>{
        return { requests: requestData.requests.map((request: any) => {
           
          return{

            request_id: request._id,
            subject: request.subject,
            user_id: request.user_id,
            faculty_id: request.faculty_id,
            status: request.status,
            filePath: request.filePath,
            creator: request.creator,
            dateRequested: request.dateRequested,
            dateAccepted: request.dateAccepted,
            semester: request.semester,
            year: request.year,
            note: request.note

          };

       
        }), maxRequests : requestData.maxRequests};

    }))
    .subscribe((transformed_post_data) => {

        this.requests = transformed_post_data.requests;

        for(let i =0; i < this.requests.length; i++){


          this.userService.getUser(this.requests[i].user_id)
          .subscribe(responseData =>{

           
             this.requests[i].user_id = responseData['l_name']+ ", "+ responseData['f_name'];

          });

          this.userService.getUser(this.requests[i].faculty_id)
          .subscribe(responseData =>{

             this.requests[i].faculty_id = responseData['l_name']+ ", "+ responseData['f_name'];

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

  addRequest(subject: string, user_id: string, faculty_id: string, status: string, desc: string, creator:string, semester: string, year:string){

    let now = new Date();
    let reqData : Request = { 

      request_id: null,
      subject:  subject,
      user_id:  user_id,
      faculty_id:  faculty_id,
      status:  status,
      desc:  desc,
      creator:  creator,
      dateRequested: now,
      dateAccepted: null,
      semester: semester,
      year: year, 
      note: null
      
  

    }
    
    console.log(reqData);
    
    return this.http.post("http://localhost:3000/api/requests", reqData)
    .pipe(catchError(this.handleError));

  }

  getRequest(id : string){
    return this.http.get<{request: Request}>("http://localhost:3000/api/requests/" + id);

  }

  getRequestByStatus(status : string){
    return this.http.get("http://localhost:3000/api/requests/" + status)
    .pipe(catchError(this.handleError));

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
   



updateRequest(_id:string, subject:string, faculty_id:string, user_id:string, status: string, creator:string, desc: string, dateRequested: Date, dateAccepted:Date, semester:string, year: string, note:string){

    let requestData : Request = {
        request_id: _id,
        subject: subject,
        faculty_id: faculty_id,
        user_id: user_id,
        status: status,
        desc: desc,
        creator: creator,
        dateRequested: dateRequested,
        dateAccepted: dateAccepted,
        semester: semester,
        year: year,
        note: note

      }

  
    
    return this.http.put("http://localhost:3000/api/requests/" + _id, requestData);
    

  }



}
