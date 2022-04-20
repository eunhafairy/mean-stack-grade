

// CREATE REQUEST DIALOG 

import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Request } from "src/app/models/request";
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
export class DialogAddRequestComponent implements AfterViewInit{


  cys:string = '';
  section : string;
  selectedStudent = '';
  selectedProfessor = '';
  students: User[];
  isLoading = false;
  request: any;
  form: FormGroup;
  subjects : Subjects[];
  professors: User[];
  selectedStatus = '';
  public stats: any = [
    {value : "Requested"}, 
    {value: "Accepted"}, 
    {value: "Revised"}];
  myRole: string;
  mode : string;
  @ViewChild('cys', {static: true}) cysElement: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DialogAddRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private requestService: RequestService,
    private userService: UserService,
    private adminService: AdminServiceService
  ) {

    this.myRole = userService.getRole();
    this.form = new FormGroup({
      'subject': new FormControl(null, {validators: [Validators.required]}),
      'faculty' : new FormControl(null, {validators: [Validators.required]}),
      'cys' : new FormControl(null, {validators: [Validators.required]}),
      'status' : new FormControl('Requested', {validators: [Validators.required]}),
      'desc' : new FormControl(null),
      'semester' : new FormControl(null, {validators: [Validators.required]}),
      'year' : new FormControl('2021-2022', {validators: [Validators.required]}),
      'student' : new FormControl('2021-2022', {validators: [Validators.required]}) });

    if(data){
      
    //mode is edit
    this.mode = "edit";
    requestService.getRequest(data)
    .subscribe( (response) => {

      
        this.request = response;
    
        //set data
        this.form.patchValue({subject : this.request.subject});
        this.form.patchValue({faculty : this.request.faculty_id});
        this.form.patchValue({status : this.request.status});
        this.form.patchValue({desc : this.request.desc});
        this.form.patchValue({semester : this.request.semester});
        this.form.patchValue({year : this.request.year});
        this.form.patchValue({cys : this.request.cys});

      
        if(this.myRole === 'Admin'){
         this.form.patchValue({student : this.request.user_id});
        }

      
    }, err=>{


      window.alert(err);

    });
    
  
  }
  else{

      //mode is create
      this.mode = "create"
      if(this.myRole === "Student"){

        console.log(this.userService.getCYS());
        this.form.patchValue({cys : this.userService.getCYS()});
        

      }


    }
  }
  ngAfterViewInit(): void {
    
    
    this.getStudentsAndProfs();
    this.getSubjects();


     }
  



  getStudentsAndProfs(){


            

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

       this.subjects = response['subjects'];
       this.subjects.sort((a,b)=>a.subject_name.localeCompare(b.subject_name));

      },
      err =>{

        console.log(err);

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


      switch(this.mode){

        case "create":
          this.requestService.addRequest(this.form.value.subject,studentName,
            this.form.value.faculty, "Requested",
            this.form.value.desc,
            this.userService.getUserId(),
            this.form.value.semester,
            this.form.value.year,
            this.form.value.cys,
            null,
            null
            )
          .subscribe(
            res=>{
              //success
              console.log("Success!", res);
              window.alert("Success!");
              this.dialogRef.close("Success");
            },
            err => {
                //error
                window.alert("Something went wrong. " + err);
                this.form.reset();
            }
          );

          break;
      
        case "edit":
          this.requestService.updateRequest(
            this.request._id, 
            this.form.value.subject,
            this.form.value.faculty,
            this.form.value.student,
            this.request.status,
            this.request.creator,
            this.form.value.desc,
            this.request.dateRequested,
            this.request.dateAccepted, 
            this.form.value.semester,
            this.form.value.year,
            this.request.note,
            this.form.value.cys,
            null,
            null).subscribe(
              res=>{

                window.alert('Success');
                console.log(res);
                this.dialogRef.close("Success");
              },
              err =>{

                window.alert("Something went wrong. " + err);
                this.dialogRef.close();

              }
            );



          break;

      }



    }

    
  }


}