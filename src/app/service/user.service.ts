import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subject } from 'rxjs';
import { AuthData } from '../models/auth_data';
import { LoginData } from '../models/login_data';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  isAuthenticated = false;
  private token:string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer : any;
  private u_id: string;
  private role:string;


  constructor(public http: HttpClient, public router: Router) { }


  // ----------CREATE USER-------------
  createUser(f_name: string, l_name: string, role:string, email:string, password:string){

    const authData : AuthData = {f_name: f_name, l_name: l_name,  role:role,email:email, password:password};
      this.http.post("http://localhost:3000/api/users/signup", authData)
      .subscribe(result =>{
        window.alert("Success!");
        this.router.navigate(['/sign-in']);
      });

  }

  getUserId(){
    return this.u_id;

  }
  getRole(){
    return this.role;

  }


  //------------LOGIN USER ----------------------
  loginUser(email:string, password: string){

    const loginData : LoginData = {

      email:email,
      password: password

    };

    this.http.post<{token:string, expiresIn: number, u_id: string, role:string}>("http://localhost:3000/api/users/login", loginData)
    .subscribe(response => {

      const token = response.token;
      this.token = token;
      if(token){

        this.u_id = response.u_id;
        this.role = response.role;
        const expiresInDuration  = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
        this.saveAuthData(token, expirationDate, this.u_id, this.role);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);

        if(this.role === 'Admin'){
          this.router.navigate(['/admin-dashboard']);
        }
        else if (this.role === 'Student'){

          this.router.navigate(['/dashboard']);
        }
        else{

          this.router.navigate(['/dashboard']);
        }
        
    
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
      this.role = null;
      this.u_id = null;

  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date, u_id: string, role:string){

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

  private setAuthTimer(duration: number){

    this.tokenTimer = setTimeout(() =>{
      this.logout();

    }, duration * 1000);

  }



}
