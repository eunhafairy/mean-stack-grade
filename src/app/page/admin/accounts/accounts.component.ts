import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent  implements OnInit, OnDestroy {


  @ViewChild(MatSort) sort: MatSort;
  
  _filter :string = '';
  public users : User[] = [];
  private userSub: Subscription = new Subscription;
  totalRequests = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  displayedColumns: string[] = [ 'first', 'last', 'email', 'role', 'delete'];
  isLoading = false;
  resultsLength = 0;
  dataSource: any;
 
  // sort

  

  constructor(private adminService: AdminServiceService) {
 
  }

  ngOnInit(): void {

    this.isLoading = true;
    this.adminService.getUsers(this.usersPerPage, this.currentPage);
    this.adminService.geUsersUpdateListener()
    .subscribe((userData: {users: User[], userCount : number}) => {
      this.isLoading = false;
      this.users = userData.users;
      this.totalRequests = userData.userCount;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    
    });
  
  }


  addUser(){


  }
  deleteUser(u_id : string){
    console.log(u_id);
  }

  onChangedPage(pageData: PageEvent){


    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.usersPerPage = pageData.pageSize;
    this.adminService.getUsers(this.usersPerPage, this.currentPage);
    this.adminService.geUsersUpdateListener()
    .subscribe((userData: {users: User[], userCount : number}) => {
      this.isLoading = false;
      this.users = userData.users;
      this.totalRequests = userData.userCount;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    });
 

  }

  applyFilter(event: Event){
   
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  showAll(){

    this._filter = "";
    this.isLoading = true;
    this.currentPage = 1;
    this.usersPerPage = this.totalRequests;
    this.adminService.getUsers(this.usersPerPage, this.currentPage);
    this.adminService.geUsersUpdateListener()
    .subscribe((userData: {users: User[], userCount : number}) => {
      this.isLoading = false;
      this.users = userData.users;
      this.totalRequests = userData.userCount;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    });




  }

  ngOnDestroy(){

this.userSub.unsubscribe();
  }


}


