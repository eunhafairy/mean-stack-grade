import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

 
  constructor(private userService : UserService) { }

  ngOnInit(): void {

  }

    signIn(form: NgForm){
      
      if(form.invalid){
        return;
      }
      this.userService.loginUser(form.value.email, form.value.password);

  }
}
