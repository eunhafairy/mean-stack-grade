import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import {Request} from '../../models/request'
import {Subject, Subscription} from 'rxjs'
import { UserService } from 'src/app/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddRequestComponent } from '../dialog-add-request/dialog-add-request.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy{

  role : string;
@Input() status:string;
requests : any[] = [];
totalRequests: number;
dataSource: any;
isLoading = false;
pageSizeOptions : number[];
private requestSub: Subscription = new Subscription;


  constructor(private requestService: RequestService, private userService: UserService, private dialog : MatDialog) {  }

  ngOnInit(): void {
    this.isLoading=true;
    this.role = this.userService.getRole();
    this.refreshTable();
  }


  completeRequest(requestId: string){

    this.isLoading= true;
    let request : Request;
    this.requestService.getRequest(requestId)
    .subscribe(res=>{

    

      this.requestService.updateRequest(res['_id'],
       res['subject'],
        res['faculty_id'],
         res['user_id'], 
         "Completed", 
         res['creator'],
         res['desc'],
         res['dateRequested'],
         res['dateAccepted'],
         res['semester'],
         res['year'],
         res['note'],
         res['cys'],
         res['verdict'],
         res['request_form'] )
         .subscribe(res=>{

          this.isLoading = false;
          window.alert("Successfully completed request!");
          window.location.reload();

         },
         err=>{
          this.isLoading = false;

          console.log(err);

         })
      
    

    })

   // this.requestService.updateRequest(request._id, request.subject, request.fac);

  }
  

deleteRequest(requestId: string){

    this.isLoading= true;

    if(window.confirm("Are you sure you want to delete?")){
      console.log("requestId is :"+ requestId);
      this.requestService.deleteRequest(requestId)
      .subscribe( () =>{
        this.isLoading=false;
        this.refreshTable();
      },
      error =>{
        this.isLoading = false;
        console.log(error);

      });
    }

    else{
        this.refreshTable();

      return;

    }
    
      
  }

  readableDate(date : Date){


    return new Date(date).toLocaleDateString();;

  }
  transformAcadYear(year: number){
    
    return "20"+year+"-"+"20"+(year+1); 
  }


  openEditRequestDialog(id: string){

     
    const dialogRef = this.dialog.open(DialogAddRequestComponent, {
      data: id
    });

    dialogRef.afterClosed().subscribe((res) => {
    
      if(res === "Success"){

        window.location.reload();

      }
     
    });



  }

  refreshTable(){

    this.isLoading = true;
    console.log(this.status);
    this.requestService.getRequestByStatus(this.status)
    .subscribe(response =>{
      this.isLoading=false;
      this.transformRequests(response['requests']);
    });
  }


  transformRequests(request:Request[]){

    this.requests = [];
    for(let i = 0; i < request.length; i++){

  
      this.requestService.autoCompleteStatus(request[i]);
  
      if(this.role !== 'Admin'){

        if(request[i].user_id === this.userService.getUserId()){
  
          this.requests.push(request[i]);
  
        }
      
      
      }
      else {
        this.requests.push(request[i]);
      }

    }

    for(let i = 0; i < this.requests.length; i++){

    
      this.userService.getUser(this.requests[i].user_id)
      .subscribe(responseData =>{

        this.requests[i].user_id = responseData['l_name'] + ", "+ responseData['f_name'];

        this.isLoading=false;


      });

      this.userService.getUser(this.requests[i].faculty_id)
      .subscribe(responseData =>{

        this.requests[i].faculty_id = responseData['l_name'] + ", "+ responseData['f_name'];
        this.isLoading=false;

      });
     
     

    }
    console.log(this.requests);

  }

  

  ngOnDestroy() {
    this.requestSub.unsubscribe();
  }

}
