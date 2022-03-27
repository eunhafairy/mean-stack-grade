import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule,  FormGroup, FormControl, Validators } from '@angular/forms';

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



  constructor() { }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm){

    if(form.value.confirmPassword !== form.value.password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
    }

  }

  //-------------check if pass is equal


}
