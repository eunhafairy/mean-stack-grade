import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import {Request} from '../../models/request'
import {Subject, Subscription} from 'rxjs'
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy{
requests : Request[] = [];
isLoading = false;
  private requestSub: Subscription = new Subscription;
  constructor(public requestService: RequestService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.requestService.getRequests();
    this.requestService.getRequestUpdateListener()
    .subscribe((requests: Request[]) => {
      this.isLoading = false;
      this.requests = requests;

    });
  }

  deleteRequest(requestId: string){

    if(window.confirm("Are you sure you want to delete?")){
      this.requestService.deleteRequest(requestId);
    }
    else{
      return;
    }
    
      
  }

  ngOnDestroy() {
    this.requestSub.unsubscribe();
  }

}
