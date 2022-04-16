

// CREATE REQUEST DIALOG 

import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subjects } from "src/app/models/subjects";
import { User } from "src/app/models/user";
import { AdminServiceService } from "src/app/service/admin-service.service";
import { RequestService } from "src/app/service/request.service";
import { UserService } from "src/app/service/user.service";



@Component({
  selector: 'dialog-add-request.component',
  templateUrl: 'dialog-add-request.component.html',
   styleUrls: ['./dialog-add-request.component.css']
})
export class DialogAddRequestComponent implements OnInit{


  students: User[];
  isLoading = false;
  form: FormGroup;
  subjects : Subjects[];
  professors: User[];
  selectedStatus = '';
  public stats: any = [
    {value : "Requested"}, 
    {value: "Accepted"}, 
    {value: "Revised"}];
  myRole: string;
  constructor(
    public dialogRef: MatDialogRef<DialogAddRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Request,
    private requestService: RequestService,
    private userService: UserService,
    private adminService: AdminServiceService
  ) {}


  ngOnInit(): void {
    
    this.myRole = this.userService.getRole();

    this.getStudents();
    this.getSubjects();

    this.form = new FormGroup({
      'subject': new FormControl(null, {validators: [Validators.required]}),
      'faculty' : new FormControl(null, {validators: [Validators.required]}),
      'status' : new FormControl('Requested', {validators: [Validators.required]}),
      'desc' : new FormControl(null),
      'semester' : new FormControl(null, {validators: [Validators.required]}),
      'year' : new FormControl('2021-2022', {validators: [Validators.required]}),
      'student' : new FormControl('2021-2022', {validators: [Validators.required]}),

  });
    
  }

  getStudents(){


        this.userService.getUserByRole("Student")
        .subscribe(
          response =>{
    
           this.students = response['users'];
           this.students.sort((a,b)=>a.l_name.localeCompare(b.l_name));
    
    
          },
          err =>{
    
            console.log(err);
    
          }
        );
    
        this.userService.getUserByRole("Faculty")
        .subscribe(
          res =>{
            
           this.professors = res['users'];
           this.professors.sort((a,b)=>a.l_name.localeCompare(b.l_name))
    
          },
          error =>{
    
            console.log(error);
          }
        );
    
      }

  getSubjects(){


    this.adminService.getSubjects()
    .subscribe(
      response =>{

        console.log(response);
       this.subjects = response['subjects'];
       this.subjects.sort((a,b)=>a.subject_name.localeCompare(b.subject_name));

      },
      err =>{

        console.log(err);

      }
    );

      this.userService.getUserByRole("Faculty")
    .subscribe(
      res =>{
        
       this.professors = res['users'];
       this.professors.sort((a,b)=>a.l_name.localeCompare(b.l_name))

      },
      error =>{

        console.log(error);
      }
    );


  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddRequest(){


    let studentName: string;
    if(this.myRole === 'Admin'){

      studentName = this.form.value.student
    }
    else{

      studentName = this.userService.getUserId();
    }
  

    if(this.form.invalid){
        
        return;
    }

    else{

      console.log("subject is : "+this.form.value.subject + this.userService.getUserId(), this.form.value.faculty, "Requested", this.form.value.desc, this.userService.getUserId());
      this.requestService.addRequest(this.form.value.subject,studentName, this.form.value.faculty, "Requested", this.form.value.desc, this.userService.getUserId(),this.form.value.semester, this.form.value.year)
      .subscribe(
        res=>{
          
          //success
          console.log("Success!", res);
          window.alert("Success!");
          this.dialogRef.close();

        },
        
        err => {
            //error
            window.alert("Something went wrong. " + err);
            this.form.reset();

        }
      );

    }

    
  }







}