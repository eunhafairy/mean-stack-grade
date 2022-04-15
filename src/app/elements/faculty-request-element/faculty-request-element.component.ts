import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Request } from 'src/app/models/request';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-faculty-request-element',
  templateUrl: './faculty-request-element.component.html',
  styleUrls: ['./faculty-request-element.component.css']
})
export class FacultyRequestElementComponent implements OnInit {

  @Input() status:string;
  requests : any[] = [];
  totalRequests: number;
  dataSource: any;
  isLoading = false;
  pageSizeOptions : number[];
  private requestSub: Subscription = new Subscription;

  constructor(private requestService: RequestService, private userService: UserService) { }

  ngOnInit(): void {
    this.refreshTable();
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

    

    for(let i = 0; i < request.length; i++){

      console.log(request[i].faculty_id + " and " + this.userService.getUserId() );
      if(request[i].faculty_id === this.userService.getUserId()){

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

   
   

  }
    acceptRequest(requestId: string){


    }
  rejectRequest(requestId: string){

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

}
