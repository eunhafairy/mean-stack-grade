import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule,  FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  selectedRole: string;
  imagePreviewPFP:string;
  fileTitlePFP: string;
  imagePreviewESig: string;
  fileTitleESig:string;
  public roles: any = [
    {value : "Student"}, 
    {value: "Faculty"}, 
    {value: "Admin"}];

@ViewChild('signUpForm', {read:NgForm}) form : any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm){

    if(form.value.confirmPassword !== form.value.password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
    }

    this.isLoading = true;
    this.userService.createUser(form.value.firstName,form.value.lastName, this.selectedRole, form.value.email,  form.value.password, this.form.value.filePickerESig, this.form.value.filePickerPFP, this.form.value.student_no );
  

  }

  
  onFilePickedESig(event: Event){

    const file = (event.target as HTMLInputElement).files[0];
    this.fileTitleESig = file.name;
    this.form.value.filePickerESig = file;
    this.form.get('filePickerESig').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
        this.imagePreviewESig = reader.result as string;
    }
    reader.readAsDataURL(file);


  }

  onFilePickedPFP(event: Event){

    const file = (event.target as HTMLInputElement).files[0];
    this.fileTitlePFP = file.name;
    this.form.patchValue({filePickerPFP : file});
    this.form.get('filePickerPFP').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
        this.imagePreviewPFP = reader.result as string;
    }
    reader.readAsDataURL(file);


  }



}
