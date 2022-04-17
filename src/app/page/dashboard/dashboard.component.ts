import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Request } from '../../models/request';
import { RequestService } from 'src/app/service/request.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RequestFormComponent } from 'src/app/elements/request-form/request-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


requests: Request[] = []
 
  constructor(public requestService : RequestService, private dialog : MatDialog) { }
 

  ngOnInit(): void {
  
  }



  
}
