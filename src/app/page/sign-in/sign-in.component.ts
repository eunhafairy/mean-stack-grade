import { Component, OnInit } from '@angular/core';

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

  signIn(){
    console.log('the email and pass are: ' + this._email + ' ' + this._pass);
  }

}
