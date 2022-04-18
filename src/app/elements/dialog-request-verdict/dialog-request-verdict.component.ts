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
    let grade;
    if(this.form.value.action === "Failed"){
    grade = '5.00';
    }
    else{
    grade = this.form.value.verdict;
    }

    //update request and proceed to Processing
    let sure = window.confirm("Are you sure you want to process this request?");
      if(sure){
       
        //update request : go to processing
        this.requestService.getRequest(this.data).subscribe(
          res => {

            let request: any = res;
            let now = new Date();
            let updatedRequest: FormData = new FormData();
            updatedRequest.append('_id', this.data);  
            updatedRequest.append('subject',  request.subject);  
            updatedRequest.append('faculty_id',   request.faculty_id);  
            updatedRequest.append('user_id',   request.user_id);  
            updatedRequest.append('status',     "Processing");  
            updatedRequest.append('creator', request.creator);  
            updatedRequest.append('desc',  request.desc);  
            updatedRequest.append('dateRequested',   request.dateRequested);  
            updatedRequest.append('dateAccepted',  now.toISOString());  
            updatedRequest.append('semester',  request.semester);  
            updatedRequest.append('year', request.year);  
            updatedRequest.append('reason', request.reason);  
            updatedRequest.append('note', request.note,);  
            updatedRequest.append('cys', request.cys);  
            updatedRequest.append('grade',   grade);  
            updatedRequest.append('request_form', null);  
            window.alert("Generating PDF File");
            console.log("here in verdict: " + updatedRequest);
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
