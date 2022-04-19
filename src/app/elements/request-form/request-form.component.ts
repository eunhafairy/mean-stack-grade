import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {

  @ViewChild('pdfForm', {static:false}) el!: ElementRef;
  // @ViewChild('student_name', {static:false}) student_name!: ElementRef;
  // @ViewChild('faculty_name', {static:false}) faculty_name!: ElementRef;
  // @ViewChild('date_requested', {static:false}) date_requested!: ElementRef;
  // @ViewChild('subject', {static:false}) subject!: ElementRef;
  // @ViewChild('semester', {static:false}) semester!: ElementRef;
  // @ViewChild('ay-1', {static:false}) ay1!: ElementRef;
  // @ViewChild('ay-2', {static:false}) ay2!: ElementRef;
  // @ViewChild('reason', {static:false}) reason!: ElementRef;
  // @ViewChild('action-passed', {static:false}) action_passed!: ElementRef;
  // @ViewChild('action-failed', {static:false}) action_failed!: ElementRef;
  // @ViewChild('rating-passed', {static:false}) rating_passed!: ElementRef;
  // @ViewChild('rating-failed', {static:false}) rating_failed!: ElementRef;
  // @ViewChild('date_accepted', {static:false}) date_accepted!: ElementRef;
  // @ViewChild('stud_signature', {static:false}) stud_signature!: ElementRef;
  // @ViewChild('professor_name', {static:false}) professor_name!: ElementRef;
  // @ViewChild('stud_id', {static:false}) stud_id!: ElementRef;
  // @ViewChild('cys', {static:false}) cys!: ElementRef;

  e_sig_path: string;
  e_sig_path_prof: string;

  prof_name: string;
  student_name: string;
  date_requested: any;
  date_accepted: any;
  visibilityIfPass: string = 'visible';
  visibilityIfFail: string = 'hidden';
    student_no : string;

    acad_year2 : number;



  constructor(  
    public dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormData,
    private requestService: RequestService,
    private userService: UserService,
    private adminService: AdminServiceService) { }

  ngOnInit(): void {


   //this.e_sig_path = this.data.get() as string;
   this.userService.getUser(this.data.get('user_id') as string)
   .subscribe(res=>{

      this.e_sig_path = res['e_sig'];
 
      this.student_name = res['f_name'] + " " + res['l_name'];
      this.student_no = res['student_no'];

      console.log(res);
     
     this.date_requested = Date.parse(this.data.get('dateRequested').toString());
     this.date_accepted = Date.parse(this.data.get('dateAccepted').toString());
    
     if(this.data.get('verdict') === '5.00'){
        this.visibilityIfPass= 'hidden'
        this.visibilityIfFail= 'visible'

     }
     });

     this.userService.getUser(this.data.get('faculty_id') as string)
     .subscribe(res =>{

      this.prof_name = res['f_name'] + " "+res['l_name'];
      this.e_sig_path_prof = res['e_sig'];
 
     })

     this.acad_year2 = +this.data.get('year') + 1;

  }

 


  

  readableDate(date : Date){

    return new Date(date).toLocaleDateString();

  }

}
