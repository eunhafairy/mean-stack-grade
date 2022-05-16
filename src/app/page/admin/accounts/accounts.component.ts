import { Component, Inject, OnInit, ViewChild, OnDestroy, Optional } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthData } from 'src/app/models/auth_data';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { UserService } from 'src/app/service/user.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AddAccountComponent } from 'src/app/elements/add-account/add-account.component';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent  implements OnInit, OnDestroy {


  _filter :string = '';
  public users : User[] = [];
  private userSub: Subscription = new Subscription;
  totalRequests = 0;
  isLoading = false;
  dataSource: any;
  displayedColumns: string[] = [ 'f_name', 'l_name', 'email',  'student_no', 'cys', 'role', 'action'];

  pageSizeOptions : number[];
  // sort
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // new user
  authData: AuthData;


  constructor(private adminService: AdminServiceService, private dialog : MatDialog, private userService: UserService) {

  }



  ngOnInit(): void {

    this.refreshTable();

  }


  addUser(){


  }
  deleteUser(u_id : string){


    if(this.userService.getUserId() === u_id){

      window.alert("You have selected your own account. If you wish to continue, please do delete it in your settings page.");
      return;

    }


    var willDelete = window.confirm('Are you sure you want to archive this account?');

    if(willDelete){
      console.log("will delete: "+ u_id);
      this.userService.updateUserStatus('Archive',u_id)
      .subscribe(result =>{

        this.isLoading = true;
        this.adminService.getUsers();
        this.adminService.geUsersUpdateListener()
        .subscribe((userData: {users: User[], userCount : number}) => {
          this.isLoading = false;
          this.users = userData.users;
          this.totalRequests = userData.userCount;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.sort = this.sort;
          //set page size options
          if( this.dataSource.data.length > 10){
            this.pageSizeOptions =  [1, 2, 5,  10, this.dataSource.data.length];
          }
          else{
            this.pageSizeOptions =  [1, 2, 5,  10];
          }

        });

      });
    }


  }


  applyFilter(event: Event){

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  showAll(){

    this._filter = "";
    this.refreshTable();
    this.paginator.pageSize = this.dataSource.data.length;



  }

   formatCYS(course: string, year: string, section: string) : string{

    if (course === undefined || course === null || course === '' || course === 'null') {

     return "";
     }
    else{
      return course + " "+year+section;
    }

  }

  ngOnDestroy(){

    this.userSub.unsubscribe();

  }

  editUser(user:any):void{


    const dialogRef = this.dialog.open(AddAccountComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.refreshTable();
    });


  }

  openDialog() : void{
    const dialogRef = this.dialog.open(AddAccountComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.refreshTable();
    });
  }


  refreshTable(){

    this.isLoading = true;

    this.adminService.getUsers();
    this.adminService.geUsersUpdateListener()
    .subscribe((userData) => {
      console.log('subscribed ' + userData);
      this.isLoading = false;
      this.users = userData.users;
      this.dataSource = new MatTableDataSource(this.users);
      this.setPageSizeOption();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    },
    err =>{

      console.log(err);
    });

  }

  setPageSizeOption(){

    if( this.dataSource.data.length > 10){
      this.pageSizeOptions =  [1, 2, 5,  10, this.dataSource.data.length];
    }
    else{
      this.pageSizeOptions =  [1, 2, 5, 10];
    }

    this.paginator.pageSize= this.dataSource.data.length;
  }


}



