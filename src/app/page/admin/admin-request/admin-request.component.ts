import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { Request } from 'src/app/models/request';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-admin-request',
  templateUrl: './admin-request.component.html',
  styleUrls: ['./admin-request.component.css']
})
export class AdminRequestComponent implements OnInit {

  isLoading = false;
  public requests : Request[] = [];


  displayedColumns: string[] = [ 'title', 'faculty', 'status', 'file', 'action'];

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
  constructor(private requestService: RequestService, private dialog : MatDialog) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.requestService.getRequests(this.requestsPerPage, this.currentPage);
    this.requestService.getRequestUpdateListener()
    .subscribe((requestsData: { requests: Request[], requestCount : number }) => {
      this.isLoading = false;
      this.requests = requestsData.requests;
      this.totalRequests = requestsData.requestCount;
      this.dataSource = new MatTableDataSource(this.requests);
      this.dataSource.sort = this.sort;
    
    });
  }

  showAll(){

  }

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
      this.totalRequests = requestsData.requestCount;
      this.dataSource = new MatTableDataSource(this.requests);
      this.dataSource.sort = this.sort;
    });
 

  }

  editRequest(request: Request){


  }

  deleteRequest(request: Request){


  }


}




@Component({
  selector: 'add-request-dialog',
  templateUrl: 'add-request-dialog.html',
   styleUrls: ['./admin-request.component.css']
})
export class AddRequestDialog implements OnInit{

  isLoading = false;
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

  onAddRequest(form: NgForm){

    if(form.value.confirmPassword !== form.value.password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
    }

    



    
  }



}
