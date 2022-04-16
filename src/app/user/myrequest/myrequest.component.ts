import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogAddRequestComponent } from 'src/app/elements/dialog-add-request/dialog-add-request.component';
import { Subjects } from 'src/app/models/subjects';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-myrequest',
  templateUrl: './myrequest.component.html',
  styleUrls: ['./myrequest.component.css']
})
export class MyrequestComponent implements OnInit {
  
  constructor(private dialog : MatDialog, private router: Router) { }

  ngOnInit(): void {


  }

  //open create request dialog
  openCreateRequestDialog(){

    const dialogRef = this.dialog.open(DialogAddRequestComponent, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(() => {
    
      window.location.reload();
     
    });



  }



}
