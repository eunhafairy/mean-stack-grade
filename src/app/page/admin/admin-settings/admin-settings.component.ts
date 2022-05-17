import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAccountComponent } from 'src/app/elements/add-account/add-account.component';
import { DialogChangePassComponent } from 'src/app/elements/dialog-change-pass/dialog-change-pass.component';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {

  fullname: string;
  user: any;
  isLoading = false;
  email: string;
  e_sig_path: string;
  constructor(private userService: UserService, private adminService: AdminServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.isLoading = true;

    this.userService.getUser(this.userService.getUserId())
    .subscribe(user => {

      this.user = user;
      this.email = this.user.email;
      this.fullname = this.user.l_name + ", "+this.user.f_name;
      this.e_sig_path = this.user.e_sig;
      this.isLoading= false;
    },
    err =>{

      console.log(err.error['message']);

    });


  }

  deleteMyAccount(){

    this.isLoading = true;
    this.userService.getUserByRole("Admin")
    .subscribe(res=>{


      console.log(res['users'].length);
      if(res['users'].length <= 1){

        // window.alert("You cannot delete your account. You are the only admin left!");
        Swal.fire({
          icon: 'warning',
          title: 'Hey!',
          text: 'You cannot delete your account. You are the only admin left!',
          allowOutsideClick: false
      })
        this.isLoading=false;
        return;
      }
      else {

        let u_id : string = this.user._id;
        var willDelete = window.confirm('Are you sure you want to delete?');

        if(willDelete){
          console.log("will delete: "+ u_id);
          this.userService.updateUserStatus('Archive',u_id)
          .subscribe(result =>{


            this.isLoading= false;
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

    })



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

      //realod
      if(res){

        window.location.reload();

      }



    });


  }

}
