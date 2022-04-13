import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Request } from '../../models/request';
import { RequestService } from 'src/app/service/request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


requests: Request[] = []
 
  constructor(public requestService : RequestService) { }
 

  ngOnInit(): void {
  
  }

  
}
