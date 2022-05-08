import { ElementRef, Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import {Request} from '../models/request'
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map} from 'rxjs';
import { serializeError } from 'serialize-error';
import { UserService } from './user.service';
import { User } from '../models/user';
import { AdminServiceService } from './admin-service.service';
import { Notif } from '../models/notif';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
private requests: Request[] = [];
private requestsUpdated = new Subject<{requests: Request [], requestCount: number}>();
private studentName:string;
private facultyName: string;
private notifs: Notif[] = [];
private notifsUpdated = new Subject<{notifs: Notif[]}>();


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

  addRequest(subject: string, user_id: string, faculty_id: string, status: string, desc: string, creator:string, semester: string, year:number, cys: string, verdict:string, request_form: File){

    let now = new Date();
    let reqData = new FormData();

      reqData.append("request_id", null);
      reqData.append("subject", subject);
      reqData.append("user_id", user_id);
      reqData.append("faculty_id", faculty_id);
      reqData.append("status", status);
      reqData.append("desc", desc);
      reqData.append("creator", creator);
      reqData.append("dateRequested", now.toISOString());
      reqData.append("dateAccepted", null);
      reqData.append("semester", semester);
      reqData.append("year", year.toString());
      reqData.append("note", null);
      reqData.append("cys", cys);
      reqData.append("verdict", verdict);
      reqData.append("request_form", request_form);

    console.log(reqData);

  
      
      return this.http.post("http://localhost:3000/api/requests", reqData)
      .pipe(catchError(this.handleError));

  }

  getRequest(id : string){
    return this.http.get("http://localhost:3000/api/requests/find/" + id)
    .pipe(catchError(this.handleError));

  }

  getRequestByUserId(user_id : string){
    return this.http.get("http://localhost:3000/api/requests/findrequestbyuser/" + user_id)
    .pipe(catchError(this.handleError));

  }
  
  getRequestByFacultyId(user_id : string){
    return this.http.get("http://localhost:3000/api/requests/findrequestbyfaculty/" + user_id)
    .pipe(catchError(this.handleError));

  }

  parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
  }

  autoCompleteStatus(request: any){

    let now = new Date().toLocaleDateString();

    if(request.status !== 'Processing' || !request.dateAccepted){

      return;

    }

    const diffInMs = Math.abs(this.parseDate(now) as any - (this.parseDate(new Date(request.dateAccepted).toLocaleDateString()) as any));
    const noOfDays = diffInMs / (1000 * 60 * 60 * 24);
    
    
    if(noOfDays >= 10){

     
      this.updateRequestStatus(request.request_id, 'Completed')
      .subscribe(res=>{
        console.log('Success!');
      },
      err=>{
        console.log('error!',err);
      });
   

    }
  


  }

  deleteNotif(id :string){

    return this.http.delete("http://localhost:3000/api/notifs/" + id)
    .pipe(catchError(this.handleError));


  }
  
  readNotif(id:string){

    let data = {

      isRead: false

    }
    return this.http
    .put("http://localhost:3000/api/notifs/changeread/" + id, data)
    .pipe(catchError(this.handleError));

  }

  updateRequestStatus(id: string, status:string){

    let data = {
      status: status
    }

    return this.http
    .put("http://localhost:3000/api/requests/updatestatus/" + id, data)
    .pipe(catchError(this.handleError));

}

  getNotifByUserId(id: string){
    return this.http.get("http://localhost:3000/api/notifs/checkread/" + id)
    .pipe(catchError(this.handleError));
  }
  getNotifByFacultyId(id: string){
    return this.http.get("http://localhost:3000/api/notifs/checkreadfaculty/" + id)
    .pipe(catchError(this.handleError));
  }


  createNotif(type: string, user_id : string, faculty_id: string, subject:string){


    let now = new Date();
    let data : Notif =  {
      type: type,
      user_id: user_id,
      faculty_id :faculty_id,
      subject: subject,
      desc: "",
      isRead: false,
      dateCreated : now
    }
    
    return this.http.post("http://localhost:3000/api/notifs", data)
    .pipe(catchError(this.handleError));


  }

  getNotifs(){

    return this.http
    .get<{notifs: Notif[]}>("http://localhost:3000/api/notifs")
    .subscribe((notifData) => {

  
      this.notifs = notifData.notifs;

      this.notifsUpdated.next({
        notifs : [...this.notifs]
      });
  });

  }

  getNotifsUpdateListener(){
    return this.notifsUpdated.asObservable();
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
   



updateRequest(id:string, 
  subject:string, 
  faculty_id:string, 
  user_id:string, 
  status: string, 
  creator:string, 
  desc: string, 
  dateRequested: Date, 
  dateAccepted:Date, 
  semester:string, 
  year: number, 
  note:string, 
  cys:string,
  verdict:string,
  request_form: File | string){

    let requestData: FormData | Request
    //adding file
    if(typeof(request_form)==='object'){

      let now = new Date();
      console.log('request form is object ' + (request_form as File).name);
      requestData = new FormData();
      requestData.append('request_id', id);
      requestData.append('subject', subject);
      requestData.append('faculty_id', faculty_id);
      requestData.append('user_id', user_id);
      requestData.append('status', status);
      requestData.append('desc', desc);
      requestData.append('creator', creator);
      requestData.append('dateRequested', new Date(dateRequested).toISOString());
      console.log("dto sa service: "+now.toISOString());
      requestData.append('dateAccepted', now.toISOString());
      requestData.append('semester', semester);
      requestData.append('year', year.toString());
      requestData.append('semester', semester);
      requestData.append('note', note);
      requestData.append('cys', cys);
      requestData.append('verdict', verdict);
      requestData.append('request_form', request_form, (request_form as File).name);

      
    }

    else{

      console.log('request form is string');

      let now = new Date();

       requestData  = {
          request_id: id,
          subject: subject,
          faculty_id: faculty_id,
          user_id: user_id,
          status: status,
          desc: desc,
          creator: creator,
          dateRequested: new Date(dateRequested),
          dateAccepted: now,
          semester: semester,
          year: year,
          note: note,
          cys: cys,
          verdict: verdict,
          request_form: request_form as string,
         
  
        }

    }

  
    
    return this.http.put("http://localhost:3000/api/requests/" + id, requestData);
    

  }






}
