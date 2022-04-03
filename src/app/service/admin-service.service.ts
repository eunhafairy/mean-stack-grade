import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  users: User[] = [];
  private usersUpdated = new Subject<{users: User [], userCount: number}>();


  constructor(public http: HttpClient, public router: Router) { }

  getUsers(usersPerPage: number, currentPage : number){

    
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;

    this.http
    .get<{message: string, users: any, maxUsers: number}>("http://localhost:3000/api/users" + queryParams)
    .subscribe((userData) => {

        console.log(userData.maxUsers);
        this.users = userData.users;

        this.usersUpdated.next({
          users : [...this.users],
          userCount: userData.maxUsers
        });
    });

  }

  geUsersUpdateListener(){
    return this.usersUpdated.asObservable();
  }

}
