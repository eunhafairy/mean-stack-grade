import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { AuthData } from '../models/auth_data';
import { LoginData } from '../models/login_data';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import {serializeError} from 'serialize-error';
import { AdminServiceService } from './admin-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private cys: string;
  private isAuthenticated = false;
  private token:string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer : any;
  private u_id: string;
  private role:string;
  public users: User[]=[];
  private usersUpdated = new Subject<{users: User [], userCount: number}>();


  constructor(public http: HttpClient, public router: Router, private adminService: AdminServiceService) { }


  // // ----------CREATE USER-------------
  // createUser(f_name: string, l_name: string, role:string, email:string, password:string, e_sig: File, pfp:File, student_no: string){

  //   let _student_no : string = " ";
    
  //   let pfp_filename : string;
  //   let e_sig_filename : string;

  //   if(student_no){
      
  //     _student_no = student_no;

  //   }

  //   if(!pfp){

  //     pfp_filename = "";
  //   }
  //   else{

  //     pfp_filename = pfp.name;

  //   }

  //   if(!e_sig){

  //     e_sig_filename = "";
  //   }
  //   else{

  //     e_sig_filename = e_sig.name;

  //   }



  //   const authData = new FormData();
  //   authData.append("f_name", f_name);
  //   authData.append("l_name", l_name);
  //   authData.append("role", role);
  //   authData.append("email", email);
  //   authData.append("password", password);
  //   authData.append("student_no", student_no);
  //   authData.append("e_sig", e_sig, e_sig_filename);
  //   authData.append("pfp", pfp, pfp_filename);
    
  //     this.http.post("http://localhost:3000/api/users/signup", authData)
  //     .pipe(
  //       catchError(this.handleError)
  //       )
  //     .subscribe(result =>{
  //       window.alert("Success!");
    
  //     })  ;

  // }

  getAllUsers(){


  }

  getCYS(){

    return this.cys;
  }
  //CREATE USER BY ADMIN  
  createUserFromAdmin(f_name: string,
    l_name: string,
    role:string, 
    email:string, 
    password:string, 
    e_sig:File, 
    student_no: string,
    course: string,
    year: string,
    section:string
    ){
    
  
    

    const authData = new FormData();
    authData.append("f_name", f_name);
    authData.append("l_name", l_name);
    authData.append("role", role);
    authData.append("email", email);
    authData.append("password", password);
    authData.append("e_sig", e_sig, e_sig.name);
    
    console.log("It is a "+role);
    if(role === 'Student'){
      authData.append("student_no", student_no);
      authData.append("course", course);
      authData.append("year", year);
      authData.append("section", section);
    }

    if(role === 'Faculty'){
      authData.append("status", "False");
    }
    


    return this.http.post("http://localhost:3000/api/users/signup", authData)
    .pipe(
      catchError(this.handleError)
      );
  
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
   
 
   

  getUserId(){
    return this.u_id;

  }
  getRole(){
    return this.role;

  }

  
  getRequestFacultyStudentName(user_id:string, faculty_id:string){

    const queryParams = `?user_id=${user_id}&faculty_id=${faculty_id}`;
    return this.http.get<{user_id: string, faculty_id:string}>("http://localhost:3000/api/users/findnames/" + queryParams)
    .pipe(catchError(this.handleError));

  }

  
  updateUser(id:string, firstName:string, lastName:string, email:string, role: string, e_sig:File | string, student_no:string, status: boolean, course:string, year:string, section:string){

    let userData : User | FormData;
    
    if(typeof(e_sig)=='object'){

      userData= new FormData();

      userData.append("u_id", id);
      userData.append("f_name", firstName);
      userData.append("l_name", lastName);
      userData.append("role", role);
      userData.append("email", email);
      userData.append("e_sig", e_sig, (e_sig as File).name);
      userData.append("student_no", student_no);
      userData.append("section", section);
      userData.append("course", course);
      userData.append("year", year);
      userData.append("status", String(status));


    }
    else{
    
    
        userData = {
          u_id: id,
          f_name:   firstName,
          l_name: lastName,
          role: role,
          email: email,
          student_no:student_no,
          e_sig:e_sig as string,
          status: status,
          course: course,
          section: section,
          year:year

  
  
        }

  

    }
  
        
  
    return this.http
    .put("http://localhost:3000/api/users/" + id, userData)
    .pipe(catchError(this.handleError));
  
  }
  //------------LOGIN USER ----------------------
  loginUser(email:string, password: string) : Observable<any>{

  
    const loginData : LoginData = {

      email:email,
      password: password

    };

    return this.http.post<{token:string, expiresIn: number, u_id: string, role:string, course: string, year: number, section: string}>("http://localhost:3000/api/users/login", loginData)
    .pipe( map(response =>{

      const token = response.token;
      this.setToken(token);
      if(token){

      
        this.u_id = response.u_id;
        this.role = response.role;
        if(this.role === 'Student'){
          
          this.cys = response.course+" "+response.year+response.section;
        }

        console.log(this.cys);
        const expiresInDuration  = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
        this.saveAuthData(token, expirationDate, this.u_id, this.role);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
    

        console.log("Success!");
         if(this.role === 'Admin'){
          this.router.navigate(['/admin-dashboard']);
        }
        else if (this.role === 'Student'){

          this.router.navigate(['/dashboard']);
        }
        else{

          this.router.navigate(['/dashboard']);
        }
       }},
       catchError(this.handleError)));
    
 

  
  }

  setToken(token: string){

    this.token = token;
  }
  
  setUID(id:string){
    this.u_id = id;
  }

  setRole(role:string){
    this.role = role;
  }

  

  getAuth(){
    return this.isAuthenticated;
  }

  getToken(){
    return this.token;
  }

  logout(){
      this.token = null;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.router.navigate(['/sign-in']);
      this.clearAuthData();
      clearTimeout(this.tokenTimer);
      this.role = null;
      this.u_id = null;

  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  saveAuthData(token: string, expirationDate: Date, u_id: string, role:string){

    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString()); 
    localStorage.setItem('u_id', u_id);
    localStorage.setItem('role', role);
  }

  private clearAuthData(){

    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("u_id");
    localStorage.removeItem("role");
  }

  autoAuthUser(){

    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){

      this.token = authInformation.token;
      this.u_id = authInformation.u_id;
      this.role = authInformation.role;
      this.setAuthTimer(expiresIn/1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);

    }


  }



  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const u_id = localStorage.getItem('u_id');
    const role = localStorage.getItem('role');
    
    if(!token || !expirationDate){
      return null;
    }
    
    return {

        token: token,
        expirationDate : new Date(expirationDate),
        u_id: u_id,
        role: role

      };

    

  }

  setAuthTimer(duration: number){

    this.tokenTimer = setTimeout(() =>{
      this.logout();

    }, duration * 1000);

  }



  //find user by role

  getUserByRole(role:string){
    
    return this.http.get("http://localhost:3000/api/users/"+ role)
    .pipe(catchError(this.handleError));
   
  }

  getUser(id:string){

 
    return this.http.get("http://localhost:3000/api/users/find/" + id)
    .pipe(catchError(this.handleError));

  }

  
}
