import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule,  FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  form : FormGroup;
  fileTitleESig:string;
  imagePreviewESig: string;
  isLoading = false;
  selectedRole: string;
  public roles: any = [
    {value : "Student"}, 
    {value: "Faculty"}];

    public years: any = [
      {value : 1},
      {value : 2},
      {value : 3},
      {value : 4}
    ];

    public courses: any = [
      {value : 'BSIT'},
      {value : 'BLIS'}
    ];

    public sections: any = [
      {value : 'A'},
      {value : 'B'},
      {value : 'C'},
      {value : 'D'},
      {value : 'E'},
      {value : 'F'},
      {value : 'G'},
      {value : 'H'},
      {value : 'I'},
      {value : 'J'},
      {value : 'K'},
      {value : 'L'},
      {value : 'M'},
      {value : 'N'},
      {value : 'O'},
      {value : 'P'},
      {value : 'Q'},
      {value : 'R'},
      {value : 'S'},
      {value : 'T'},
      {value : 'U'},
      {value : 'V'},
      {value : 'W'},
      {value : 'X'},
      {value : 'Y'},
      {value : 'Z'}
    ];




  constructor(private userService: UserService, private router: Router) { }

  
  ngOnInit(): void {

    this.form = new FormGroup({
      '__first_name': new FormControl(null, {validators: [Validators.required]}),
      '__last_name' : new FormControl(null, {validators: [Validators.required]}),
      '__role' : new FormControl(null, {validators: [Validators.required]}),
      '__email' : new FormControl(null, {validators: [Validators.required]}),
      '__password' : new FormControl(null, {validators: [Validators.required]}),
      '__confirm_password' : new FormControl(null, {validators: [Validators.required]}),
      '__fileESig' : new FormControl(null, {validators: [Validators.required]}),
      '__student_no' : new FormControl(null, {validators: [Validators.required]}),
      '__course' : new FormControl(null, {validators: [Validators.required]}),
      '__section' : new FormControl(null, {validators: [Validators.required]}),
      '__year' : new FormControl(null, {validators: [Validators.required]})


  });



  }

  onSignUp(){

   if(this.form.value.__confirm_password !== this.form.value.__password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
    }
  
  if(this.form.value.__role === 'Student' && (this.form.value.__student_no === null || this.form.value.__student_no === '' )){

      return;

    }
  if(this.form.value.__role != 'Student'){

      this.form.value.__student_no = null;

    }

  if(!this.form.value.__fileESig ){

    window.alert('Please upload a signatures');
    return;
  }

    console.log(this.form.value.__student_no);
    this.isLoading = true;
    
    this.userService.createUserFromAdmin(this.form.value.__first_name,
      this.form.value.__last_name, 
      this.selectedRole, 
      this.form.value.__email,  
      this.form.value.__password, 
      this.form.value.__fileESig,this.form.value.__student_no,
      this.form.value.__course,
      this.form.value.__year,
      this.form.value.__section)
    .subscribe(
      
      (response)=>{

        //success
        console.log(response);
        window.alert("Success!");
        this.isLoading = false;
        this.router.navigate(['/sign-in']);
       
      },
      
      (error) =>{

        //error
      window.alert(error);
      this.isLoading = false;
      this.form.reset();
      this.fileTitleESig = '';
      this.imagePreviewESig = '';


    });

  }

  
  onFilePickedESig(event: Event){

    const file = (event.target as HTMLInputElement).files[0];
    this.fileTitleESig = file.name;
    this.form.patchValue({__fileESig: file});
    this.form.get('__fileESig').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
        this.imagePreviewESig = reader.result as string;
    }
    reader.readAsDataURL(file);


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


  


}
