import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
  isLoading = false;
  resultsLength = 0;
  dataSource: any;
  displayedColumns: string[] = [ 'f_name', 'l_name', 'email',  'student_no', 'role', 'action'];
 
  pageSizeOptions : number[];
  // sort
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // new user 
  authData: AuthData;
  

  constructor(private adminService: AdminServiceService, private dialog : MatDialog) {
 
  }

  

  ngOnInit(): void {

    this.refreshTable();
  
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

  ngOnDestroy(){

    this.userSub.unsubscribe();

  }

  editUser(user:any):void{

    const editedUser : User =({
      u_id : user._id,
      f_name : user.f_name,
      l_name: user.l_name,
      role: user.role,
      email: user.email,
      student_no: user.student_no,
      e_sig: user.e_sig
    
    });
    const dialogRef = this.dialog.open(DialogContentEdit, {
      width: '80%',
      data: editedUser
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.refreshTable();
    });


  }

  openDialog() : void{
    const dialogRef = this.dialog.open(DialogContent, {
      width: '80%',
      data: this.authData
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.refreshTable();
    });
  }


  refreshTable(){

    console.log('enter resfresh tabkle');
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


//add user modal

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
   styleUrls: ['./accounts.component.css']
})
export class DialogContent implements OnInit {


 form : FormGroup;
  fileTitlePFP:string;
  imagePreviewPFP: string = '../../../assets/images/default_cict.png';
  fileTitleESig : string;
  imagePreviewESig: string;
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
  ngOnInit(): void {

    this.form = new FormGroup({
      '__first_name': new FormControl(null, {validators: [Validators.required]}),
      '__last_name' : new FormControl(null, {validators: [Validators.required]}),
      '__role' : new FormControl(null, {validators: [Validators.required]}),
      '__email' : new FormControl(null, {validators: [Validators.required]}),
      '__password' : new FormControl(null, {validators: [Validators.required]}),
      '__confirm_password' : new FormControl(null, {validators: [Validators.required]}),
      '__filePFP' : new FormControl(null),
      '__fileESig' : new FormControl(null, {validators: [Validators.required]}),
      '__student_no' : new FormControl(null, {validators: [Validators.required]})


  });



  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSignUp(){

    if(this.form.value.__confirm_password !== this.form.value.__password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
    }

    this.isLoading = true;
    this.userService.createUserFromAdmin(this.form.value.__first_name,
      this.form.value.__last_name,
      this.selectedRole,
      this.form.value.__email,  
      this.form.value.__password, 
      this.form.value.__fileESig,
      this.form.value.__student_no)
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

  onFilePickedESig(event: Event){

    const file = (event.target as HTMLInputElement).files[0];
    this.fileTitleESig = file.name;
    this.form.patchValue({__fileESig: file});
    this.form.get('__fileESig').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
        this.imagePreviewESig = reader.result as string;
    }
    reader.readAsDataURL(file);


  }

  onFilePickedPFP(event: Event){

    const file = (event.target as HTMLInputElement).files[0];
    this.fileTitlePFP = file.name;
    this.form.patchValue({__filePFP: file});
  this.form.get('__filePFP').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
        this.imagePreviewPFP = reader.result as string;
    }
    reader.readAsDataURL(file);


  }



}



  //EDIT MODAL

  

  @Component({
    selector: 'dialog-content-edit',
    templateUrl: 'dialog-content-edit.html',
     styleUrls: ['./accounts.component.css']
  })
  export class DialogContentEdit implements OnInit {
  
    form : FormGroup;
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
    _role: string;
    imagePreviewESig : string;
    fileTitleESig: string;
  
  
    constructor(
      public dialogRef: MatDialogRef<DialogContentEdit>,
      @Inject(MAT_DIALOG_DATA) public data: User,
      private userService: UserService
    ) {

      this.selectedRole= data.role as string;
      console.log(this.selectedRole);
      

    }
    ngOnInit(): void {
     
    this.form = new FormGroup({
      '__first_name': new FormControl(null, {validators: [Validators.required]}),
      '__last_name' : new FormControl(null, {validators: [Validators.required]}),
      '__role' : new FormControl(null, {validators: [Validators.required]}),
      '__email' : new FormControl(null, {validators: [Validators.required]}),
      '__fileESig' : new FormControl(null, {validators: [Validators.required]}),
      '__student_no' : new FormControl(null, {validators: [Validators.required]})


      });

      //set values
      this.form.patchValue({__first_name : this.data.f_name});
      this.form.patchValue({__last_name : this.data.l_name});
      this.form.patchValue({__role : this.data.role});
      this.form.patchValue({__email : this.data.email});
      this.form.patchValue({__fileESig : this.data.e_sig});
      this.form.patchValue({__student_no : this.data.student_no});
      this.imagePreviewESig = this.data.e_sig;
 
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }


    onEdit(){

  

      if(this.form.invalid){
        console.log(this.findInvalidControls());
        return;
      }   
      
      console.log('went here');

      this.isLoading = true;
      this.userService.updateUser(this.data.u_id,
        this.form.value.__first_name,
        this.form.value.__last_name,
        this.form.value.__email,
        this.form.value.__role,
        this.form.value.__fileESig,
        this.form.value.__student_no)
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

    onFilePickedESig(event: Event){

      const file = (event.target as HTMLInputElement).files[0];
      this.fileTitleESig = file.name;
      this.form.patchValue({__fileESig: file});
      this.form.get('__fileESig').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () =>{
          this.imagePreviewESig = reader.result as string;
      }
      reader.readAsDataURL(file);
  
  
    }


    public findInvalidControls() {
      const invalid = [];
      const controls = this.form.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              invalid.push(name);
          }
      }
      return invalid;
    }
  
  
    
  
    }
  
  

