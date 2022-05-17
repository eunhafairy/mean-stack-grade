import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { Request } from 'src/app/models/request';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { map } from 'rxjs';
import { DialogAddRequestComponent } from 'src/app/elements/dialog-add-request/dialog-add-request.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-request',
  templateUrl: './admin-request.component.html',
  styleUrls: ['./admin-request.component.css']
})
export class AdminRequestComponent implements OnInit {

  isLoading = false;
  public requests : Request[] = [];


  displayedColumns: string[] = [ 'subject', 'user_id','faculty_id', 'status', 'action'];

  //pagination
  totalRequests = 0;
  pageSizeOptions : number[]= []
  dataSource: any;

  //filter
  _filter = "";

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private requestService: RequestService, private dialog : MatDialog, private userService:UserService) { }

  ngOnInit(): void {

    this.refreshTable();

  }



  showAll(){

    this._filter = "";
    this.refreshTable();
    this.paginator.pageSize = this.dataSource.data.length;



  }



  refreshTable(){

    this.isLoading = true;

    this.requestService.getRequests();
    this.requestService.getRequestUpdateListener()
     .subscribe((requestsData: { requests: Request[], requestCount : number }) => {

      this.transformRequests(requestsData.requests);

     },
        error=>{


          console.log('error '+ error);
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

  transformRequests(request:Request[]){

    this.requests = request;

    for(let i = 0; i < request.length; i++){


     this.requestService.autoCompleteStatus(request[i])

      this.userService.getUser(request[i].user_id)
      .subscribe(responseData =>{

        this.requests[i].user_id = responseData['l_name'] + ", "+ responseData['f_name'];

      });

      this.userService.getUser(request[i].faculty_id)
      .subscribe(responseData =>{

        this.requests[i].faculty_id = responseData['l_name'] + ", "+ responseData['f_name'];

        if(i === (request.length-1)){

          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.requests);
          this.totalRequests = this.dataSource.data.length;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.setPageSizeOption();

        }


      });





    }




  }




  openDialog(){


    const dialogRef = this.dialog.open(DialogAddRequestComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.refreshTable();

      });


  }



  applyFilter(event: Event){

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }





  editRequest(id: string){

    console.log(id);
    const dialogRef = this.dialog.open(DialogAddRequestComponent, {
      width: '80%',
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.refreshTable();

      });


  }

  deleteRequest(request: Request){


    this.isLoading= true;

    if(window.confirm("Are you sure you want to delete?")){

      this.requestService.deleteRequest(request.request_id)
      .subscribe(
        (response) =>{

          console.log(response);
          // window.alert("Successfully deleted request!");
          Swal.fire({
            icon: 'success',
            title: 'Yehey!',
            text: 'Successfully deleted request!',
            allowOutsideClick: false
        })
          this.isLoading = true;
          this.refreshTable();
      },
      (error) =>{
        // window.alert("Error deleting" + error);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Something went wrong!',
          allowOutsideClick: false
      })
        this.isLoading= false;
      });
    }
    else{
      return;
    }



  }


}




// @Component({
//   selector: 'add-request-dialog',
//   templateUrl: 'add-request-dialog.html',
//    styleUrls: ['./admin-request.component.css']
// })
// export class AddRequestDialog implements OnInit{

//   isLoading = false;
//   form: FormGroup;
//   selectedStatus = '';
//   public stats: any = [
//     {value : "Requested"},
//     {value: "Accepted"},
//     {value: "Revised"}];


//   public students: User[];
//   public professors: User[];




//   constructor(
//     public dialogRef: MatDialogRef<AddRequestDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: Request,
//     private requestService: RequestService,
//     private userService: UserService
//   ) {}


//   ngOnInit(): void {


//     this.getStudents();

//     this.form = new FormGroup({
//       'title': new FormControl(null, {validators: [Validators.required]}),
//       'student' : new FormControl(null, {validators: [Validators.required]}),
//       'faculty' : new FormControl(null, {validators: [Validators.required]}),
//       'status' : new FormControl('Requested', {validators: [Validators.required]}),
//       'desc' : new FormControl(null)

//   });

//   }

//   getStudents(){


//     this.userService.getUserByRole("Student")
//     .subscribe(
//       response =>{

//        this.students = response['users'];
//        this.students.sort((a,b)=>a.l_name.localeCompare(b.l_name));


//       },
//       err =>{

//         console.log(err);

//       }
//     );

//     this.userService.getUserByRole("Faculty")
//     .subscribe(
//       res =>{

//        this.professors = res['users'];
//        this.professors.sort((a,b)=>a.l_name.localeCompare(b.l_name))

//       },
//       error =>{

//         console.log(error);
//       }
//     );

//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   onAddRequest(){


//     if(this.form.invalid){

//         return;
//     }
//     else{

//       console.log('went here');
//       this.requestService.addRequest(this.form.value.title,this.form.value.student, this.form.value.faculty, this.form.value.status, this.form.value.desc, this.userService.getUserId())
//       .subscribe(
//         res=>{

//           //success
//           console.log("Success!", res);
//           window.alert("Success!");
//           this.dialogRef.close();

//         },

//         err => {
//             //error
//             window.alert("Something went wrong. " + err);
//             this.form.reset();

//         }
//       );

//     }


//   }







// }
