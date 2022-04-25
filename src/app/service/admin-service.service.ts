import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Subject, throwError } from 'rxjs';
import { User } from '../models/user';
import {Subjects} from '../models/subjects'
import { serializeError } from 'serialize-error';



@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  public users: User[] = [];
  private usersUpdated = new Subject<{users: User []}>();

  private subjects : Subjects[]=[];
  private subjectsUpdated = new Subject<{subjects: Subjects[]}>();


  constructor(public http: HttpClient, public router: Router) { }

  getUsers(){

    
    this.http
    .get<{message: string, users: User[]}>("http://localhost:3000/api/users")
    .subscribe((userData) => {

  
        this.users = userData.users;

        this.usersUpdated.next({
          users : [...this.users]
        });
    });

  }

  geUsersUpdateListener(){
    return this.usersUpdated.asObservable();
  }

  deleteUser(u_id: string)
  {
      return this.http.delete("http://localhost:3000/api/users/" + u_id);
  }

  //SUBJECTS
  getFacultyByStatus(status: string){


    return this.http.get("http://localhost:3000/api/users/faculty/" + status)
    .pipe(catchError(this.handleError));


  }
  getSubjects(){

    return this.http
    .get<{subjects: Subjects[], message: string}>("http://localhost:3000/api/subjects")
    .subscribe((subjectData) => {

  
      this.subjects = subjectData.subjects;

      this.subjectsUpdated.next({
        subjects : [...this.subjects]
      });
  });

  }

  getSubjectsUpdateListener(){
    return this.subjectsUpdated.asObservable();
  }


  createSubject(subjectCode: string, subjectName : string, subjectDesc : string){


    const subjectData : Subjects = { subject_id:null ,subject_code: subjectCode, subject_name: subjectName,  subject_description:subjectDesc};
    
   return this.http.post("http://localhost:3000/api/subjects/create", subjectData)
    .pipe(
      catchError(this.handleError)
      );
  

  }

  deleteSubject(id:string){

    return this.http.delete("http://localhost:3000/api/subjects/" + id);

  }

  updateSubject(_subj: Subjects){
  
    let id : string;
    let subjData : Subjects;
    subjData = {
        subject_id: _subj.subject_id,
        subject_code:   _subj.subject_code,
        subject_name: _subj.subject_name,
        subject_description: _subj.subject_description
      }

   id = subjData.subject_id;
  
    
  
    return this.http
    .put("http://localhost:3000/api/subjects/" + id, subjData)
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


 



}
