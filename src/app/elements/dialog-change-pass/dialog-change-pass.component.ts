import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-dialog-change-pass',
  templateUrl: './dialog-change-pass.component.html',
  styleUrls: ['./dialog-change-pass.component.css']
})
export class DialogChangePassComponent implements OnInit {

  myRole : string;
  isLoading = false;

  hidePass = true;
  hideNewPass = true;
  hideReEnterNewPass = true;


  form : FormGroup;
  constructor( public dialogRef: MatDialogRef<DialogChangePassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private requestService: RequestService,
    private userService: UserService,
    private adminService: AdminServiceService) {

      this.myRole = userService.getRole();


        this.form = new FormGroup({
          'current_password': new FormControl(null, {validators: [Validators.required]}),
          'new_password' : new FormControl(null, {validators: [Validators.required]}),
          'confirm_password' : new FormControl(null, {validators: [Validators.required]}),
        });


        }

  ngOnInit(): void {
  }

  onChangePass(){

    this.isLoading= true;
    //check if form is valid
    if(this.form.invalid){
      this.isLoading=false;
      return;
    }

    //check if new password and confirm password are the same

    if(this.form.value.new_password !== this.form.value.confirm_password){

      // window.alert("Make sure your new password and confirmed password are the same!");
      Swal.fire({
        icon: 'warning',
        title: 'Hey!',
        text: 'Make sure your new password and confirmed password are the same!',
        allowOutsideClick: false
    })
      this.isLoading=false;
      return;
    }

    //check if password is correct
    console.log('in dialog: ' + this.form.value.current_password);
    this.userService.checkPass(this.userService.getUserId(), this.form.value.current_password)
    .subscribe(res =>{

      //proceed to put request
      this.userService.changePass(this.userService.getUserId(), this.form.value.new_password)
      .subscribe(res=>{

        this.isLoading= false;
        console.log(res);
        // window.alert("Success!");
        Swal.fire({
          icon: 'success',
          title: 'Yehey!',
          text: 'Password Changed!',
          allowOutsideClick: false
      }).then(result =>{
        this.isLoading = false;
        if(result.isConfirmed){

          this.dialogRef.close("Success");
          
        }

      })
      },
      err=>{


        // console.log("Error occured! " + err);
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

    },
    err=>{

      console.log(err);
      // window.alert("Wrong password!");
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Wrong Password!',
        allowOutsideClick: false
      })

      this.isLoading= false;

    })







    //check for errors

    //close if successful



  }
  onNoClick(){

    Swal.fire({
      title: 'Are you sure you want to discard your progress?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5a68f0',
      cancelButtonColor: '#f05a5a',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    })

  }

}
