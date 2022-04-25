import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAccountComponent } from 'src/app/elements/add-account/add-account.component';
import { DialogChangePassComponent } from 'src/app/elements/dialog-change-pass/dialog-change-pass.component';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { UserService } from 'src/app/service/user.service';

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

  constructor(private userService: UserService,
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
      this.adminService.deleteUser(u_id)
      .subscribe(result =>{

        this.isLoading = false;

        window.alert("Your account was successfully deleted!");
        this.userService.logout();
       

      });
    }

    
  }

  changePassword(){


     //open dialog
      const dialogRef = this.dialog.open(DialogChangePassComponent, {
      width: '80%'
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
      width: '80%',
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
