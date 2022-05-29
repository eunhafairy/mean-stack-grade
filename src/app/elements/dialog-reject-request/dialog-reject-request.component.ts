import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Request } from 'src/app/models/request';
import { RequestService } from 'src/app/service/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dialog-reject-request',
  templateUrl: './dialog-reject-request.component.html',
  styleUrls: ['./dialog-reject-request.component.css']
})
export class DialogRejectRequestComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogRejectRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private requestService: RequestService
  ) {

    this.form = new FormGroup({
      'note': new FormControl(null, {validators: [Validators.required]})
    });

    this.form.patchValue({note: "Some fields in the form you submitted have incorrect information."});


   }

  ngOnInit(): void {


  }

  onReject(){

    let request: any;
    if(this.data){


      console.log("to reject: "+this.data);
      this.requestService.getRequest(this.data)
      .subscribe(
        res =>{

          request = res;
          console.log(request);
          let today = new Date();
         this.requestService.updateRequest(request._id,request.subject, request.faculty_id,
          request.user_id,
          "Rejected",
          request.creator,
          request.desc,
          request.dateRequested,
          today,
          request.semester,
          request.year,
          this.form.value.note,
          request.cys,
          null,
          request.request_form).subscribe(res=>{

            this.requestService.createNotif('Reject',
            request.user_id,
            request.faculty_id,
            request.subject)
            .subscribe(res=>{

              // window.alert("Request rejected!");
              Swal.fire({
                icon: 'warning',
                title: 'Hey!',
                text: 'Request rejected!',
                allowOutsideClick: false
            }).then(result =>{
              this.isLoading = false;
              if(result.isConfirmed){
    
                this.dialogRef.close("Success");
                
              }
    
            })

            },
            err=>{
              // window.alert("Error has occurred " +err);
              Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Something went wrong!',
                allowOutsideClick: false
            }).then(result =>{
              this.isLoading = false;
              if(result.isConfirmed){
    
                this.dialogRef.close();
                
              }
    
            })
           

            })


          });
        },
        err =>{

          // window.alert("Error has occurred " +err);
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong!',
            allowOutsideClick: false
        }).then(result =>{
          this.isLoading = false;
          if(result.isConfirmed){

            this.dialogRef.close();
            
          }

        })
       
        }
      );




    }
    else{

      // window.alert("Something went wrong");
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong!',
        allowOutsideClick: false
    })

    }

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
