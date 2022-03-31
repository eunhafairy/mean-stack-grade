import { Component, OnInit } from '@angular/core';
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
  selectedRole: string;
  public roles: any = [
    {value : "Student"}, 
    {value: "Faculty"}, 
    {value: "Admin"}];



  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm){

    if(form.value.confirmPassword !== form.value.password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
    }

    this.userService.createUser(form.value.firstName,form.value.lastName, this.selectedRole, form.value.email,  form.value.password);
  

  }



}
