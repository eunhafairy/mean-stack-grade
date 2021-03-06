import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {

  hide = true;
  fileTitleProfilePic: string;
  fileTitleProfilePicPrev: string;
  form : FormGroup;
  fileTitleESig:string;
  imagePreviewESig: string;
  isLoading = false;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({

      'l_name' : new FormControl(null, {validators: [Validators.required]}),
      'f_name' : new FormControl(null, {validators: [Validators.required]}),
      'email' : new FormControl(null, {validators: [Validators.required]}),
      'password' : new FormControl(null, {validators: [Validators.required]}),
      'confirm_password' : new FormControl(null, {validators: [Validators.required]})

   
    })


  }

  
  onRegister(){
    
    
    if(this.form.invalid){
      console.log(this.findInvalidControls());
      window.alert("Complete all fields" );
      return;
    }
    
    if(!this.checkPasswordIfSame(this.form.value.password, this.form.value.confirm_password)){

    
      window.alert('Make sure your password and confirm password is the same!');
      return;

    }
    else{
      
    let passcode = prompt("Please enter the admin creation passcode");

    if(passcode === this.userService.getAdminPasscode()){

      this.isLoading=true;

      this.userService.createAdmin(
        this.form.value.l_name,
        this.form.value.f_name,
        this.form.value.email,
        this.form.value.password
  
      ).subscribe(res => {
        console.log(res)
        window.alert('Success!');
        this.isLoading=false;
        this.router.navigate(['/sign-in']);
      },
      error=>{
        window.alert('Error! ' +error);
        this.isLoading=false;
        console.log(error)
      });

    }
    else {
      window.alert('Wrong passcode!');
      this.isLoading=false;

      return;

    }




    }



  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  checkPasswordIfSame(pass: string, c_pass: string){

    if(pass === c_pass){
      return true;

      
    }
    else{

      return false;

    }
  }

}
