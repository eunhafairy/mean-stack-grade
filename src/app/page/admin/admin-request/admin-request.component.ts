import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { Request } from 'src/app/models/request';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { map } from 'rxjs';
@Component({
  selector: 'app-admin-request',
  templateUrl: './admin-request.component.html',
  styleUrls: ['./admin-request.component.css']
})
export class AdminRequestComponent implements OnInit {

  isLoading = false;
  public requests : Request[] = [];


  displayedColumns: string[] = [ 'title', 'user_id','faculty_id', 'status', 'action'];

  //pagination
  totalRequests = 0;
  requestsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  resultsLength = 0;
  dataSource: any;

  //filter
  _filter = "";

  @ViewChild(MatSort) sort: MatSort;
  constructor(private requestService: RequestService, private dialog : MatDialog, private userService:UserService) { }

  ngOnInit(): void {

    this.isLoading = true;
    
    this.requestService.getRequests(this.requestsPerPage, this.currentPage);
    this.requestService.getRequestUpdateListener()
     .subscribe((requestsData: { requests: Request[], requestCount : number }) => {
   
      this.requests = requestsData.requests;
      this.isLoading = false;
      //this.transformRequests(requestsData.requests);

      this.totalRequests = requestsData.requestCount;
      this.dataSource = new MatTableDataSource(this.requests);
      this.dataSource.sort = this.sort;
    
    });
  }

  showAll(){

    this._filter = "";
    this.isLoading = true;
    this.currentPage = 1;
    this.requestsPerPage = this.totalRequests;
    this.requestService.getRequests(this.requestsPerPage, this.currentPage);
    this.requestService.getRequestUpdateListener()
    .subscribe((requestData: {requests: Request[], requestCount : number}) => {
      this.isLoading = false;
      this.requests = requestData.requests;
      this.totalRequests = requestData.requestCount;
      this.dataSource = new MatTableDataSource(this.requests);
      this.dataSource.sort = this.sort;
    });


  }

  // transformRequests(request:Request[]){

   

  //   this.requests = request;

  //   for(let i = 0; i < request.length; i++){

  //     //console.log("request no. "+i+": " + JSON.stringify(request[i]));
  //     this.userService.getUser(request[i].user_id)
  //     .subscribe(responseData =>{

  //       this.requests[i].user_id = responseData.l_name + ", "+ responseData.f_name;

  //       this.isLoading=false;


  //     });

  //     this.userService.getUser(request[i].faculty_id)
  //     .subscribe(responseData =>{

  //       this.requests[i].faculty_id =responseData.l_name + ", "+ responseData.f_name;
  //       this.isLoading=false;

  //     });
     
     

  //   }
    

  // }



  // getUserName(id:string): string{

  //   let name : string;

  //   this.userService.getUser(id)
  //   .subscribe(

  //     res =>{

  //       console.log(res);
  //       name = res['l_name']+", "+ res['f_name'];


  //     },
  //     err =>{

  //       console.log("Error " + err);
  //     }

  //   );

  //     return name;
  
  // }

  openDialog(){


    const dialogRef = this.dialog.open(AddRequestDialog, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.isLoading = true;
    this.requestService.getRequests(this.requestsPerPage, this.currentPage);
    this.requestService.getRequestUpdateListener()
    .subscribe((requestsData: { requests: Request[], requestCount : number }) => {
      this.isLoading = false;
      this.requests = requestsData.requests;
    //  this.transformRequests(requestsData.requests);
      this.totalRequests = requestsData.requestCount;
      this.dataSource = new MatTableDataSource(this.requests);
      });
    });


  }

  applyFilter(event: Event){

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  

  onChangedPage(pageData: PageEvent){


    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.requestsPerPage = pageData.pageSize;
    this.requestService.getRequests(this.requestsPerPage, this.currentPage);
    this.requestService.getRequestUpdateListener()
    .subscribe((requestsData: {requests: Request[], requestCount : number}) => {
      this.isLoading = false;
      this.requests = requestsData.requests;
     // this.transformRequests(requestsData.requests);
      this.totalRequests = requestsData.requestCount;
      this.dataSource = new MatTableDataSource(this.requests);
      this.dataSource.sort = this.sort;
    });
 

  }

  editRequest(request: Request){


  }

  deleteRequest(request: Request){


    this.isLoading= true;

    if(window.confirm("Are you sure you want to delete?")){

      this.requestService.deleteRequest(request.request_id)
      .subscribe( 
        (response) =>{
        
          console.log(response);
          window.alert("Successfully deleted request!");
          this.isLoading = true;
          this.requestService.getRequests(this.requestsPerPage, this.currentPage);
          this.requestService.getRequestUpdateListener()
          .subscribe((requestsData: { requests: Request[], requestCount : number }) => {
            this.isLoading = false;
            this.requests = requestsData.requests;
         //   this.transformRequests(requestsData.requests);
            this.totalRequests = requestsData.requestCount;
            this.dataSource = new MatTableDataSource(this.requests);
      });
      },
      (error) =>{
        window.alert("Error deleting" + error);
        this.isLoading= false;
      });
    }
    else{
      return;
    }
    


  }


}




@Component({
  selector: 'add-request-dialog',
  templateUrl: 'add-request-dialog.html',
   styleUrls: ['./admin-request.component.css']
})
export class AddRequestDialog implements OnInit{

  isLoading = false;
  form: FormGroup;
  fileTitle: string;
  selectedStatus = '';
  public stats: any = [
    {value : "Requested"}, 
    {value: "Accepted"}, 
    {value: "Revised"}];


  public students: User[];
  public professors: User[];




  constructor(
    public dialogRef: MatDialogRef<AddRequestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Request,
    private requestService: RequestService,
    private userService: UserService
  ) {}


  ngOnInit(): void {
    
    
    this.getStudents();

    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required]}),
      'student' : new FormControl(null, {validators: [Validators.required]}),
      'faculty' : new FormControl(null, {validators: [Validators.required]}),
      'status' : new FormControl('Requested', {validators: [Validators.required]}),
      '__file' : new FormControl(null)
  });
    
  }

  getStudents(){


    this.userService.getUserByRole("Student")
    .subscribe(
      response =>{

       this.students = response['users'];
       this.students.sort((a,b)=>a.l_name.localeCompare(b.l_name));


      },
      err =>{

        console.log(err);

      }
    );

    this.userService.getUserByRole("Faculty")
    .subscribe(
      res =>{
        
       this.professors = res['users'];
       this.professors.sort((a,b)=>a.l_name.localeCompare(b.l_name))

      },
      error =>{

        console.log(error);
      }
    );

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddRequest(){


    if(this.form.invalid){
        
        return;
    }
    else{

      console.log('went here');
      this.requestService.addRequest(this.form.value.title,this.form.value.student, this.form.value.faculty, this.form.value.status, this.form.value.__file)
      .subscribe(
        res=>{
          
          //success
          console.log("Success!", res);
          window.alert("Success!");
          this.dialogRef.close();

        },
        
        err => {
            //error
            window.alert("Something went wrong. " + err);
            this.form.reset();

        }
      );

    }

    
  }


   //===============SAVE FILE=================
   onFilePicked(event: Event){

    const file = (event.target as HTMLInputElement).files[0];
    this.fileTitle = file.name;
    this.form.patchValue({__file : file});
    this.form.get('__file').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      
    }
    reader.readAsDataURL(file);

  }




}
