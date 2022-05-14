import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  mode: string;
 form : FormGroup;
 fileTitlePFP:string;
 imagePreviewPFP: string = '../../../assets/images/default_cict.png';
 fileTitleESig : string;
 imagePreviewESig: string;
 isLoading = false;
 selectedRole: string;
 public roles: any = [
   {value : "Student"}, 
   {value: "Faculty"}, 
   {value: "Admin"}];

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
role : string;
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


  constructor(
    public dialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService) { }

  ngOnInit(): void {
    
    console.log(this.data);
    
    if(this.data){

      //edit account
      this.mode = 'edit';
    


      console.log('editing...');

    }
    else{

      this.mode = 'create';

    }

    this.role = this.userService.getRole();

    this.form = new FormGroup({
      '__first_name': new FormControl(null, {validators: [Validators.required]}),
      '__last_name' : new FormControl(null, {validators: [Validators.required]}),
      '__role' : new FormControl(null, {validators: [Validators.required]}),
      '__email' : new FormControl(null, {validators: [Validators.required]}),
      '__password' : new FormControl(null, {validators: [Validators.required]}),
      '__confirm_password' : new FormControl(null, {validators: [Validators.required]}),
      '__fileESig' : new FormControl(null, {validators: [Validators.required]}),
      '__student_no' : new FormControl(null, {validators: [Validators.nullValidator]}),
      '__course' : new FormControl(null),
      '__section' : new FormControl(null),
      '__year' : new FormControl(null)});


    if(this.mode === 'edit'){

      this.selectedRole = this.data.role;
      console.log("patching values!");
      this.form.patchValue({__first_name : this.data.f_name});
      this.form.patchValue({__last_name : this.data.l_name});
      this.form.patchValue({__role : this.data.role});
      this.form.patchValue({__email : this.data.email});
      this.form.patchValue({__fileESig : this.data.e_sig});
      
      if(this.data.role === 'Student'){

        this.form.patchValue({__student_no : this.data.student_no});
        this.form.patchValue({__course : this.data.course});
        this.form.patchValue({__year : this.data.year});
        this.form.patchValue({__section : this.data.section});


      }
      if(this.data.role === 'Faculty'){

        console.log(this.data.status);
        this.form.patchValue({__status : this.data.status});

      }

      this.imagePreviewESig = this.data.e_sig;

      //patch values

    }

  //if edit 

}

    onNoClick(): void {
      this.dialogRef.close();
    }


    onSubmit(){


      //NOT MATCHING PASSWORD
      if(this.mode === 'create' && this.form.value.__confirm_password !== this.form.value.__password){
        window.alert("Make sure the password and confirm password are the same.");
        return;
      }

      //SPECIAL CASES FOR STUDENT
      if(this.form.value.__role === "Student"){

          if(!this.form.value.__course || !this.form.value.__year || !this.form.value.__section ||  !this.form.value.__student_no){
            window.alert('Please complete all fields!');
            return;
          }
      }

    


      //FORM IS VALID
  
      if(this.mode === 'edit'){

        this.isLoading = true;
        this.userService.updateUser(this.data._id,
          this.form.value.__first_name,
          this.form.value.__last_name,
          this.form.value.__email,
          this.form.value.__role,
          this.form.value.__fileESig,
          this.form.value.__student_no,
          this.data.status,
          this.form.value.__course,
          this.form.value.__year,
          this.form.value.__section)
        .subscribe(
          response =>{
  
            window.alert("User edited!");
            this.isLoading = false;
            this.dialogRef.close('success');
          },
          error =>{
  
            window.alert(error);
            this.isLoading = false;
          }
        );

      }

      //if create new 

      else{

        this.isLoading = true;
        this.userService.createUserFromAdmin(this.form.value.__first_name,
        this.form.value.__last_name,
        this.selectedRole,
        this.form.value.__email,  
        this.form.value.__password, 
        this.form.value.__fileESig,
        this.form.value.__student_no,
        this.form.value.__course,
        this.form.value.__year,
        this.form.value.__section)
    .subscribe(
      (response)=>{
        //success
        console.log(response);
        window.alert("Success!");
        this.isLoading = false;
        this.dialogRef.close('success');
      },
      
      (error) =>{

        //error
      window.alert(error);
      this.isLoading = false;
      this.dialogRef.close('failed');

    });

      }

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
