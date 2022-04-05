import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthData } from 'src/app/models/auth_data';
import { NgForm } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { UserService } from 'src/app/service/user.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
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
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  displayedColumns: string[] = [ 'first', 'last', 'email', 'role', 'delete'];
  isLoading = false;
  resultsLength = 0;
  dataSource: any;
 
  // sort
  @ViewChild(MatSort) sort: MatSort;

  // new user 
  authData: AuthData;
  

  constructor(private adminService: AdminServiceService, private dialog : MatDialog) {
 
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

    var willDelete = window.confirm('Are you sure you want to delete?');

    if(willDelete){
      console.log("will delete: "+ u_id);
      this.adminService.deleteUser(u_id)
      .subscribe(result =>{

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

      });
    }

    
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

  editUser(user:any):void{

    const editedUser : User =({
      u_id : user._id,
      f_name : user.f_name,
      l_name: user.l_name,
      role: user.role,
      email: user.email
    
    });
    const dialogRef = this.dialog.open(DialogContentEdit, {
      width: '80%',
      data: editedUser
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
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
    });


  }

  openDialog() : void{
    const dialogRef = this.dialog.open(DialogContent, {
      width: '80%',
      data: this.authData
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
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
    });
  }


}


//add user modal

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
   styleUrls: ['./accounts.component.css']
})
export class DialogContent {

  isLoading = false;
  selectedRole: string;
  public roles: any = [
    {value : "Student"}, 
    {value: "Faculty"}, 
    {value: "Admin"}];


  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSignUp(form: NgForm){

    if(form.value.confirmPassword !== form.value.password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
    }

    this.isLoading = true;
    this.userService.createUserFromAdmin(form.value.firstName,form.value.lastName, this.selectedRole, form.value.email,  form.value.password)
    .subscribe(
      
      (response)=>{

        //success
        console.log(response);
        window.alert("Success!");
        this.isLoading = false;
        this.dialogRef.close();
      },
      
      (error) =>{

        //error
      window.alert(error);
      this.isLoading = false;
      this.dialogRef.close();

    });
    

  

  }



}



  //EDIT MODAL

  

  @Component({
    selector: 'dialog-content-edit',
    templateUrl: 'dialog-content-edit.html',
     styleUrls: ['./accounts.component.css']
  })
  export class DialogContentEdit {
  
    isLoading = false;
    selectedRole: string = '';
    public roles: any = [
      {value : "Student"}, 
      {value: "Faculty"}, 
      {value: "Admin"}];

    _firstName : string;
    _lastName: string;
    _email:string;
    _password:string;
    _confirmPassword: string;
  
  
    constructor(
      public dialogRef: MatDialogRef<DialogContent>,
      @Inject(MAT_DIALOG_DATA) public data: User,
      private userService: UserService
    ) {

      this.selectedRole= data.role as string;
      console.log(this.selectedRole);
      

    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }


    onEdit(form : NgForm){


      if(form.invalid){
        return;
      }

      this.isLoading = true;
      this.userService.updateUser(this.data.u_id, form.value.firstName, form.value.lastName,form.value.email, form.value.role)
      .subscribe(
        response =>{

          window.alert("User edited!");
          this.isLoading = false;
          this.dialogRef.close();
        },
        error =>{

          window.alert(error);
          this.isLoading = false;
        }
      );

    }
  
    
    
  
    }
  
  

