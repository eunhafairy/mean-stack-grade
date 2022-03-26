import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { Request } from 'src/app/models/request';
import { RequestComponent } from 'src/app/elements/request/request.component';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  title: string = '';
  user_id: string = '';
  faculty_id: string = '';
  status: string = 'Requested';
  private mode = 'create';
  public requestId : string = '';
  request?: any = [];
  selectedStatus:string = '';
isLoading = false;

  public stats: any = [
    {value : "Requested"}, 
    {value: "Accepted"}, 
    {value: "Revised"}];

  constructor(public requestService: RequestService, public router: Router, public activeRoute: ActivatedRoute) { }




  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((paramMap : ParamMap) => {


      if(paramMap.has('requestId')){
          this.mode = 'edit';
          this.requestId = paramMap.get('requestId') as string;

          this.isLoading= true;
          this.requestService.getRequest(this.requestId).subscribe( requestData => {
            this.isLoading= false;
            this.request = {
              request_id : requestData._id,
              title: requestData.title,
              user_id: requestData.user_id,
              faculty_id: requestData.faculty_id,
              status: requestData.status  }

          });
          this.selectedStatus = this.request.status;
      }
      else{
        this.mode = 'create'
        this.requestId = '';
        this.selectedStatus = this.stats[0].value;
    
        
      }

    });
  }

  onSaveRequest(postForm: NgForm){
    if(postForm.invalid){
      return;
    }

    this.isLoading = true;

    if (this.mode === "create"){

      this.requestService.addRequest( postForm.value.title, postForm.value.user_id ,postForm.value.faculty_id, this.selectedStatus);
      window.alert('Request added!');
    }
    else{
      this.requestService.updateRequest(this.requestId, postForm.value.title, postForm.value.user_id ,postForm.value.faculty_id, this.selectedStatus);
      console.log( this.selectedStatus)
      window.alert('Request updated!');
    }
    postForm.resetForm();
    this.router.navigate(["/dashboard"]);
  }


}
