import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import {Request} from '../../models/request'
import {Subject, Subscription} from 'rxjs'
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy{

@Input() status:string;
requests : any[] = [];
totalRequests: number;
dataSource: any;
isLoading = false;
pageSizeOptions : number[];
private requestSub: Subscription = new Subscription;


  constructor(private requestService: RequestService, private userService: UserService) {  }

  ngOnInit(): void {
    this.refreshTable();
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
        
        console.log(error);

      });
    }

    else{

      return;

    }
    
      
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

    this.requests = request;

    for(let i = 0; i < request.length; i++){

    
      this.userService.getUser(request[i].user_id)
      .subscribe(responseData =>{

        this.requests[i].user_id = responseData['l_name'] + ", "+ responseData['f_name'];

        this.isLoading=false;


      });

      this.userService.getUser(request[i].faculty_id)
      .subscribe(responseData =>{

        this.requests[i].faculty_id = responseData['l_name'] + ", "+ responseData['f_name'];
        this.isLoading=false;

      });
     
     

    }

  }

  

  ngOnDestroy() {
    this.requestSub.unsubscribe();
  }

}
