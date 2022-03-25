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
  private requestSub: Subscription = new Subscription;
  constructor(public requestService: RequestService) { }

  ngOnInit(): void {
    this.requests = this.requestService.getRequests();
    this.requestService.getRequestUpdateListener()
    .subscribe((requests: Request[]) => {

        this.requests = requests;

    });
  }
  ngOnDestroy() {
    this.requestSub.unsubscribe();
  }

}
