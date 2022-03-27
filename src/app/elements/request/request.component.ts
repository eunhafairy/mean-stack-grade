import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import {Request} from '../../models/request'
import {Subject, Subscription} from 'rxjs'
import {PageEvent} from '@angular/material/paginator'
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy{
requests : Request[] = [];
totalRequests = 0;
requestPerPage = 2;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];

isLoading = false;
  private requestSub: Subscription = new Subscription;
  constructor(public requestService: RequestService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.requestService.getRequests(this.requestPerPage, this.currentPage);
    this.requestService.getRequestUpdateListener()
    .subscribe((requestsData: {requests: Request[], requestCount : number}) => {
      this.isLoading = false;
      this.requests = requestsData.requests;
      this.totalRequests = requestsData.requestCount;

    });
  }

  deleteRequest(requestId: string){

    this.isLoading= true;
    if(window.confirm("Are you sure you want to delete?")){
      this.requestService.deleteRequest(requestId)
      .subscribe( () =>{
        this.requestService.getRequests(this.requestPerPage, this.currentPage);
      });
    }
    else{
      return;
    }
    
      
  }

  onChangedPage(pageData: PageEvent){

    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.requestPerPage = pageData.pageSize;
    this.requestService.getRequests(this.requestPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.requestSub.unsubscribe();
  }

}
