import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subject } from 'rxjs';
import { AuthData } from '../models/auth_data';
import { LoginData } from '../models/login_data';
import { SignInComponent } from '../page/sign-in/sign-in.component';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  isAuthenticated = false;
  private token:string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer : any;

  constructor(private http: HttpClient, public router: Router,private signIn : SignInComponent) { }


  //----------CREATE USER-------------
  createUser(f_name: string, l_name: string, role:string, email:string, password:string){

    const authData : AuthData = {f_name: f_name, l_name: l_name,  role:role,email:email, password:password};
      this.http.post("http://localhost:3000/api/users/signup", authData)
      .subscribe(result =>{
        console.log(result);
      });

  }


  //------------LOGIN USER ----------------------
  loginUser(email:string, password: string){

    const loginData : LoginData = {

      email:email,
      password: password

    };

    this.http.post<{token:string, expiresIn: number}>("http://localhost:3000/api/users/login", loginData)
    .subscribe(response => {

      const token = response.token;
      this.token = token;
      if(token){

        const expiresInDuration  = response.expiresIn;
         this.setAuthTimer(expiresInDuration);
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
        this.saveAuthData(token, expirationDate);
        this.isAuthenticated = true;
        this.router.navigate(['/dashboard']);
    
      }
     

      

      
      
    }, error => {

      return {'error_message' : error.status};
  
    });

  
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

  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date){

    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString()); 
  
  }

  private clearAuthData(){

    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
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
      this.setAuthTimer(expiresIn/1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);

    }


  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if(!token || !expirationDate){
      return null;
    }
    
    return {

        token: token,
        expirationDate : new Date(expirationDate)

      };

    

  }

  private setAuthTimer(duration: number){

    this.tokenTimer = setTimeout(() =>{
      this.logout();

    }, duration * 1000);

  }



}
