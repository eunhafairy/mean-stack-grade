import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subjects } from 'src/app/models/subjects';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-myrequest',
  templateUrl: './myrequest.component.html',
  styleUrls: ['./myrequest.component.css']
})
export class MyrequestComponent implements OnInit {

  constructor(private dialog : MatDialog, private router: Router) { }

  ngOnInit(): void {
  }

  //open create request dialog
  openCreateRequestDialog(){

    
    const dialogRef = this.dialog.open(CreateRequestDialog, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      this.router.navigate(['/myrequest']);
      console.log(result);
    });



  }

}


// CREATE REQUEST DIALOG 



@Component({
  selector: 'add-request-dialog',
  templateUrl: 'add-request-dialog.html',
   styleUrls: ['./myrequest.component.css']
})
export class CreateRequestDialog implements OnInit{

  isLoading = false;
  form: FormGroup;
  subjects : Subjects[];
  professors: User[];
  selectedStatus = '';
  public stats: any = [
    {value : "Requested"}, 
    {value: "Accepted"}, 
    {value: "Revised"}];






  constructor(
    public dialogRef: MatDialogRef<CreateRequestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Request,
    private requestService: RequestService,
    private userService: UserService,
    private adminService: AdminServiceService
  ) {}


  ngOnInit(): void {
    
    
    this.getSubjects();

    this.form = new FormGroup({
      'subject': new FormControl(null, {validators: [Validators.required]}),
      'faculty' : new FormControl(null, {validators: [Validators.required]}),
      'status' : new FormControl('Requested', {validators: [Validators.required]}),
      'desc' : new FormControl(null)

  });
    
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


    if(this.form.invalid){
        
        return;
    }

    else{

      console.log("subject is : "+this.form.value.subject + this.userService.getUserId(), this.form.value.faculty, "Requested", this.form.value.desc, this.userService.getUserId());
      this.requestService.addRequest(this.form.value.subject,this.userService.getUserId(), this.form.value.faculty, "Requested", this.form.value.desc, this.userService.getUserId())
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