import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAccountComponent } from 'src/app/elements/add-account/add-account.component';
import { DialogChangePassComponent } from 'src/app/elements/dialog-change-pass/dialog-change-pass.component';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.css']
})
export class FacultyProfileComponent implements OnInit {

  isLoading=false;
  fullname:string;
  e_sig_path:string;
  user: any;
  email: string;

  requestNo : number = 0;
  pendingNo: number  = 0;
  completedNo: number  = 0;

  constructor(private userService: UserService,
    private requestService: RequestService,
     private adminService: AdminServiceService,
     private dialog : MatDialog) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.userService.getUser(this.userService.getUserId())
    .subscribe(user => {

    this.isLoading = false;

      this.user = user;
      this.fullname = this.user.l_name + ", "+this.user.f_name;
      this.e_sig_path = this.user.e_sig;
      this.email = this.user.email;

      this.requestService.getRequestByFacultyId(this.userService.getUserId())
      .subscribe(
        res=>{
          console.log(res['posts']);
          for(let i = 0; i <  res['posts'].length; i++){

            switch(res['posts'][i].status){

              case 'Processing':
              this.pendingNo+=1;
              break;
              case 'Requested':
              this.requestNo+=1;
              break;
              case 'Completed':
              this.completedNo+=1;
              break;
            }

          }
          this.isLoading = false;


        },
        err=>{
          this.isLoading = false;
          // console.log(err);
          // window.alert(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong!',
            allowOutsideClick: false
        })


        }
      )
    },
    err =>{
      this.isLoading = false;

      console.log(err.error['message']);

    });






  }

  deleteMyAccount(){
    this.isLoading = true;

    let u_id : string = this.user._id;
    var willDelete = window.confirm('Are you sure you want to delete?');

    if(willDelete){
      console.log("will delete: "+ u_id);
      this.userService.updateUserStatus('Archive',u_id)
      .subscribe(result =>{

        this.isLoading = false;

        // window.alert("Your account was successfully deleted!");
        Swal.fire({
          icon: 'success',
          title: 'Yehey!',
          text: 'Your account was successfully deleted!',
          allowOutsideClick: false
      })
        this.userService.logout();


      });
    }


  }

  changePassword(){


     //open dialog
      const dialogRef = this.dialog.open(DialogChangePassComponent, {
    });

    dialogRef.afterClosed().subscribe((res) => {

      //realod
      if(res){

        window.location.reload();

      }



    });


  }

  editMyAccount(){


    const dialogRef = this.dialog.open(AddAccountComponent, {
      data: this.user
    });

    dialogRef.afterClosed().subscribe((res) => {

      //reload
      if(res){

        window.location.reload();

      }



    });





  }

}
