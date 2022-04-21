import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Request } from 'src/app/models/request';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-dialog-request-verdict',
  templateUrl: './dialog-request-verdict.component.html',
  styleUrls: ['./dialog-request-verdict.component.css']
})
export class DialogRequestVerdictComponent implements OnInit {

 
  form : FormGroup;
  isLoading = false;
  selectedVerdict: string;
  selectedAction :string;
  verdicts : any = [
     {value: '1.00'},
     {value: '1.25'},
     {value: '1.50'},
     {value: '1.75'},
     {value: '2.00'},
     {value: '2.25'},
     {value: '2.50'},
     {value: '2.75'},
     {value: '3.00'}
  ];
  actions: any = [
   {value: 'Passed'},
   {value: 'Failed'},   
   
  ]
 
   constructor(
     public dialogRef: MatDialogRef<DialogRequestVerdictComponent>,
     @Inject(MAT_DIALOG_DATA) public data: string,
     private requestService : RequestService
   ) {

    

   }
   ngOnInit(): void {
    
   this.form = new FormGroup({
     'action': new FormControl(null, {validators: [Validators.required]}),
     'verdict': new FormControl(null, {validators: [Validators.required]})
    
     });

     this.form.patchValue({action : 'Passed'});
     this.selectedAction = 'Passed'
  
   }
 
   onNoClick(): void {
     this.dialogRef.close();
   }

   onSubmit(){

    //check if form is invalid
    if(this.form.value.action === 'Passed' && !this.form.value.verdict){
      return;
    }    
    
    //check if pass or failed (failed automatic 5.00)
    

    //update request and proceed to Processing
    let sure = window.confirm("Are you sure you want to process this request?");
      if(sure){
       
        //update request : go to processing
        this.requestService.getRequest(this.data).subscribe(
          res => {

            let grade: string;
              if(this.form.value.action === "Failed"){
              grade = '5.00';
              }
              else{
              grade = this.form.value.verdict;
              }

            let request: any = res;
            let now = new Date();
            let updatedRequest: Request = {

              request_id: this.data,
              subject: request.subject,
              faculty_id: request.faculty_id,
              user_id: request.user_id,
              status: "Processing",
              creator: request.creator,
              desc: request.desc,
              dateRequested: request.dateRequested,
              dateAccepted: now,
              semester: request.semester,
              year: request.year,
              note: request.note,
              cys: request.cys,
              verdict: grade,
              request_form: request.request_form


            }
          
            this.dialogRef.close(updatedRequest);
         
          });

      }


      else{
        return;
      }
    
   
   }


   public findInvalidControls() {
     const invalid = [];
     const controls = this.form.controls;
     for (const name in controls) {
         if (controls[name].invalid) {
             invalid.push(name);
         }
     }
     return invalid;
   }
 
}
