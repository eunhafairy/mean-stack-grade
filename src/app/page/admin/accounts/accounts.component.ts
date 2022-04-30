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


    const dialogRef = this.dialog.open(AddAccountComponent, {
      width: '80%',
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


// //add user modal

// @Component({
//   selector: 'dialog-content',
//   templateUrl: 'dialog-content.html',
//    styleUrls: ['./accounts.component.css']
// })
// export class DialogContent implements OnInit {


//  form : FormGroup;
//   fileTitlePFP:string;
//   imagePreviewPFP: string = '../../../assets/images/default_cict.png';
//   fileTitleESig : string;
//   imagePreviewESig: string;
//   isLoading = false;
//   selectedRole: string;
//   public roles: any = [
//     {value : "Student"},
//     {value: "Faculty"},
//     {value: "Admin"}];

//     public years: any = [
//       {value : 1},
//       {value : 2},
//       {value : 3},
//       {value : 4}
//     ];

//     public courses: any = [
//       {value : 'BSIT'},
//       {value : 'BLIS'}
//     ];

//     public sections: any = [
//       {value : 'A'},
//       {value : 'B'},
//       {value : 'C'},
//       {value : 'D'},
//       {value : 'E'},
//       {value : 'F'},
//       {value : 'G'},
//       {value : 'H'},
//       {value : 'I'},
//       {value : 'J'},
//       {value : 'K'},
//       {value : 'L'},
//       {value : 'M'},
//       {value : 'N'},
//       {value : 'O'},
//       {value : 'P'},
//       {value : 'Q'},
//       {value : 'R'},
//       {value : 'S'},
//       {value : 'T'},
//       {value : 'U'},
//       {value : 'V'},
//       {value : 'W'},
//       {value : 'X'},
//       {value : 'Y'},
//       {value : 'Z'}
//     ];


//   constructor(
//     public dialogRef: MatDialogRef<DialogContent>,
//     @Inject(MAT_DIALOG_DATA) public data: User,
//     private userService: UserService
//   ) {}
//   ngOnInit(): void {

//     this.form = new FormGroup({
//       '__first_name': new FormControl(null, {validators: [Validators.required]}),
//       '__last_name' : new FormControl(null, {validators: [Validators.required]}),
//       '__role' : new FormControl(null, {validators: [Validators.required]}),
//       '__email' : new FormControl(null, {validators: [Validators.required]}),
//       '__password' : new FormControl(null, {validators: [Validators.required]}),
//       '__confirm_password' : new FormControl(null, {validators: [Validators.required]}),
//       '__fileESig' : new FormControl(null, {validators: [Validators.required]}),
//       '__student_no' : new FormControl(null, {validators: [Validators.nullValidator]}),
//       '__course' : new FormControl(null),
//       '__section' : new FormControl(null),
//       '__year' : new FormControl(null)


//   });



//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   onSignUp(){


//     console.log('ERROR '+ this.findInvalidControls());
//     //CHECK IF FORM IS INVALID --
//     if(this.form.invalid){


//       window.alert("Please complete all fields!");
//       return;
//     }

//     //NOT MATCHING PASSWORD
//     if(this.form.value.__confirm_password !== this.form.value.__password){
//       window.alert("Make sure the password and confirm password are the same.");
//       return;
//     }

//     //SPECIAL CASES FOR STUDENT
//     if(this.form.value.__role === "Student"){

//         if(!this.form.value.__course || !this.form.value.__year || !this.form.value.__section ||  !this.form.value.__student_no){
//           window.alert('Please complete all fields!');
//           return;
//         }
//     }


//   //FORM IS VALID -- CONTINUE
//     this.isLoading = true;
//     this.userService.createUserFromAdmin(this.form.value.__first_name,
//       this.form.value.__last_name,
//       this.selectedRole,
//       this.form.value.__email,
//       this.form.value.__password,
//       this.form.value.__fileESig,
//       this.form.value.__student_no,
//       this.form.value.__course,
//       this.form.value.__year,
//       this.form.value.__section)
//     .subscribe(

//       (response)=>{

//         //success
//         console.log(response);
//         window.alert("Success!");
//         this.isLoading = false;
//         this.dialogRef.close();
//       },

//       (error) =>{

//         //error
//       window.alert(error);
//       this.isLoading = false;
//       this.dialogRef.close();

//     });




//   }

//   onFilePickedESig(event: Event){

//     const file = (event.target as HTMLInputElement).files[0];
//     this.fileTitleESig = file.name;
//     this.form.patchValue({__fileESig: file});
//     this.form.get('__fileESig').updateValueAndValidity();
//     const reader = new FileReader();
//     reader.onload = () =>{
//         this.imagePreviewESig = reader.result as string;
//     }
//     reader.readAsDataURL(file);


//   }


//   public findInvalidControls() {
//     const invalid = [];
//     const controls = this.form.controls;
//     for (const name in controls) {
//         if (controls[name].invalid) {
//             invalid.push(name);
//         }
//     }
//     return invalid;
//   }








// }



//   //EDIT MODAL



//   @Component({
//     selector: 'dialog-content-edit',
//     templateUrl: 'dialog-content-edit.html',
//      styleUrls: ['./accounts.component.css']
//   })
//   export class DialogContentEdit implements OnInit {

//     form : FormGroup;
//     isLoading = false;
//     selectedRole: string = '';
//     selectedStatus: string;
//     public roles: any = [
//       {value : "Student"},
//       {value: "Faculty"},
//       {value: "Admin"}];

//     public status: any = [
//       {value : 'false'},
//       {value : 'true'}

//     ];
//     public years: any = [
//       {value : 1},
//       {value : 2},
//       {value : 3},
//       {value : 4}
//     ];

//     public courses: any = [
//       {value : 'BSIT'},
//       {value : 'BLIS'}
//     ];

//     public sections: any = [
//       {value : 'A'},
//       {value : 'B'},
//       {value : 'C'},
//       {value : 'D'},
//       {value : 'E'},
//       {value : 'F'},
//       {value : 'G'},
//       {value : 'H'},
//       {value : 'I'},
//       {value : 'J'},
//       {value : 'K'},
//       {value : 'L'},
//       {value : 'M'},
//       {value : 'N'},
//       {value : 'O'},
//       {value : 'P'},
//       {value : 'Q'},
//       {value : 'R'},
//       {value : 'S'},
//       {value : 'T'},
//       {value : 'U'},
//       {value : 'V'},
//       {value : 'W'},
//       {value : 'X'},
//       {value : 'Y'},
//       {value : 'Z'}
//     ];


//     _firstName : string;
//     _lastName: string;
//     _email:string;
//     _password:string;
//     _confirmPassword: string;
//     _role: string;
//     imagePreviewESig : string;
//     fileTitleESig: string;


//     constructor(
//       public dialogRef: MatDialogRef<DialogContentEdit>,
//       @Inject(MAT_DIALOG_DATA) public data: User,
//       private userService: UserService
//     ) {

//       this.selectedRole= data.role as string;
//       this.selectedStatus = data.status;
//     }
//     ngOnInit(): void {

//     this.form = new FormGroup({
//       '__first_name': new FormControl(null, {validators: [Validators.required]}),
//       '__last_name' : new FormControl(null, {validators: [Validators.required]}),
//       '__role' : new FormControl(null, {validators: [Validators.required]}),
//       '__email' : new FormControl(null, {validators: [Validators.required]}),
//       '__fileESig' : new FormControl(null, {validators: [Validators.required]}),

//       '__student_no' : new FormControl(null),
//         '__status' : new FormControl(false),
//       '__course' : new FormControl(null),
//       '__section' : new FormControl(null),
//       '__year' : new FormControl(null)
//       });

//       //set values
//       this.form.patchValue({__first_name : this.data.f_name});
//       this.form.patchValue({__last_name : this.data.l_name});
//       this.form.patchValue({__role : this.data.role});
//       this.form.patchValue({__email : this.data.email});
//       this.form.patchValue({__fileESig : this.data.e_sig});

//       if(this.data.role === 'Student'){

//         this.form.patchValue({__student_no : this.data.student_no});
//         this.form.patchValue({__course : this.data.course});
//         this.form.patchValue({__year : this.data.year});
//         this.form.patchValue({__section : this.data.section});


//       }
//       if(this.data.role === 'Faculty'){

//         console.log(this.data.status);
//         this.form.patchValue({__status : this.data.status});

//       }

//       this.imagePreviewESig = this.data.e_sig;

//     }

//     onNoClick(): void {
//       this.dialogRef.close();
//     }


//     onEdit(){


//       //CHECK IF FORM IS INVALID --
//       if(this.form.invalid){
//         window.alert("Please complete all fields!");
//         return;
//       }

//       //NOT MATCHING PASSWORD
//       if(this.form.value.__confirm_password !== this.form.value.__password){
//         window.alert("Make sure the password and confirm password are the same.");
//         return;
//       }

//       //SPECIAL CASES FOR STUDENT
//       if(this.form.value.__role === "Student"){

//           if(!this.form.value.__course || !this.form.value.__year || !this.form.value.__section ||  !this.form.value.__student_no){
//             window.alert('Please complete all fields!');
//             return;
//           }
//       }

//       //SPECIAL CASES FOR FACULTY
//       else if(this.form.value.__role === "Faculty"){

//           if(!this.form.value.__status){
//               window.alert('Please complete all fields!');
//               return;
//           }

//       }

//       //FORM IS VALID

//       this.isLoading = true;
//       this.userService.updateUser(this.data.u_id,
//         this.form.value.__first_name,
//         this.form.value.__last_name,
//         this.form.value.__email,
//         this.form.value.__role,
//         this.form.value.__fileESig,
//         this.form.value.__student_no,
//         this.form.value.__status,
//         this.form.value.__course,
//         this.form.value.__year,
//         this.form.value.__section)
//       .subscribe(
//         response =>{

//           window.alert("User edited!");
//           this.isLoading = false;
//           this.dialogRef.close();
//         },
//         error =>{

//           window.alert(error);
//           this.isLoading = false;
//         }
//       );

//     }

//     onFilePickedESig(event: Event){

//       const file = (event.target as HTMLInputElement).files[0];
//       this.fileTitleESig = file.name;
//       this.form.patchValue({__fileESig: file});
//       this.form.get('__fileESig').updateValueAndValidity();
//       const reader = new FileReader();
//       reader.onload = () =>{
//           this.imagePreviewESig = reader.result as string;
//       }
//       reader.readAsDataURL(file);


//     }


//     public findInvalidControls() {
//       const invalid = [];
//       const controls = this.form.controls;
//       for (const name in controls) {
//           if (controls[name].invalid) {
//               invalid.push(name);
//           }
//       }
//       return invalid;
//     }




//     }



