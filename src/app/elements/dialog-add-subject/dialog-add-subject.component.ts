import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, NgModel, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subjects } from 'src/app/models/subjects';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dialog-add-subject',
  templateUrl: './dialog-add-subject.component.html',
  styleUrls: ['./dialog-add-subject.component.css']
})
export class DialogAddSubjectComponent implements OnInit {

  @ViewChild('subjectCode', {static:true}) subjCodeInput : NgModel;
  isLoading = false;
  mode: string;
  subject : Subjects;
  form : FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogAddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminServiceService
  ) {

    this.form = new FormGroup({


      'subjectCode' : new FormControl(null, {validators: [Validators.required]}),
      'subjectName' : new FormControl(null, {validators: [Validators.required]}),
      'subjectDesc' : new FormControl(null, {validators: [Validators.required]})



    });

    if (this.data){

      this.mode = 'edit';
      this.form.patchValue({subjectCode : this.data.subject_code});
      this.form.patchValue({subjectName : this.data.subject_name});
      this.form.patchValue({subjectDesc : this.data.subject_description});

     }
     else{
       this.mode = 'create';
     }

  }

  ngOnInit(): void {


  }

  onNoClick(): void {

    this.dialogRef.close();

  }

  onCreateSubject(){


    this.isLoading = true;

    if(this.form.invalid){
      return;
    }

    if(this.mode == "create"){

      this.adminService.createSubject(this.form.value.subjectCode,this.form.value.subjectName, this.form.value.subjectDesc)
      .subscribe(

        (response)=>{

          //success
          console.log(response);
          // window.alert("Success!");
          Swal.fire({
            icon: 'success',
            title: 'Yehey!',
            text: 'Added subject successfully!',
            allowOutsideClick: false
          })
          this.isLoading = false;
          this.dialogRef.close("Success");
        },

        (error) =>{

          //error
        // window.alert(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Something went wrong!',
          allowOutsideClick: false
      })
        this.isLoading = false;
        this.dialogRef.close("Failed");

      });

    }
    else{

        this.subject =  {

        subject_id: this.data._id,
        subject_code: this.form.value.subjectCode,
        subject_name:  this.form.value.subjectName,
        subject_description:  this.form.value.subjectDesc


      }

      this.adminService.updateSubject(this.subject)
      .subscribe(
        response =>{

          // window.alert("Subject udpated!");
          Swal.fire({
            icon: 'success',
            title: 'Yehey!',
            text: 'Subject updated!',
            allowOutsideClick: false
        })
          this.isLoading = false;
          this.dialogRef.close();
        },
        error =>{

          // window.alert(error);
          // console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong!',
            allowOutsideClick: false
        })
          this.isLoading = false;
        }
      );;


    }





  }
}
