import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
_email = '';
_pass = '';
 
  constructor() { }

  ngOnInit(): void {
  }

  signIn(postForm: NgForm){
    
    if(postForm.invalid){
      return;
    }
    this._email = postForm.value._email;
    this._pass = postForm.value.pass;
    console.log(this._email, this._pass);

  }

}
