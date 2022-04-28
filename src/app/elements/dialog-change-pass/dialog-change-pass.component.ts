import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';

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

      window.alert("Make sure your new password and confirmed password are the same!");
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
        window.alert("Success!");
        this.dialogRef.close("Success");
      },
      err=>{


        console.log("Error occured! " + err);
        this.dialogRef.close();
      })

    },
    err=>{

      console.log(err);
      window.alert("Wrong password!");
      this.isLoading= false;

    })







    //check for errors

    //close if successful



  }
  onNoClick(){

    this.dialogRef.close();

  }

}
