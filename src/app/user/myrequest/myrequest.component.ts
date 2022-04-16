import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogAddRequestComponent } from 'src/app/elements/dialog-add-request/dialog-add-request.component';


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
      width: '80%',
      data: null
    });

    dialogRef.afterClosed().subscribe((res) => {
    
      
      if(res === "Success"){

        window.location.reload();

      }
     
    });



  }

  



}
