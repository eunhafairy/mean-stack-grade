import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from '../models/auth_data';
import { LoginData } from '../models/login_data';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token:string;
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient) { }


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
    this.http.post<{token:string}>("http://localhost:3000/api/users/login", loginData)
    .subscribe(response =>{

      const token = response.token;
      this.token = token;
      this.authStatusListener.next(true);
      
    });

  }

  getToken(){
    return this.token;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }




}
