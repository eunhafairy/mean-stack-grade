import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'path';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
isLoading = false;
 
  constructor(private userService : UserService, public router: Router) { }

  ngOnInit(): void {

  }

    signIn(form: NgForm){
      
      if(form.invalid){
        return;
      }
      this.isLoading=true;
      this.userService.loginUser(form.value.email, form.value.password)
      


  }
}
