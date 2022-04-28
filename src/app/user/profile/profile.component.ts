import { Component, OnInit, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAccountComponent } from 'src/app/elements/add-account/add-account.component';
import { DialogChangePassComponent } from 'src/app/elements/dialog-change-pass/dialog-change-pass.component';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user : any;
  fullname: string;
  cys: string;
  e_sig_path:string;


  constructor(private userService: UserService,
    private adminService: AdminServiceService,
    private dialog: MatDialog) { }

  ngOnInit(): void {

   this.userService.getUser(this.userService.getUserId())
    .subscribe(user => {

      this.user = user;
      this.cys = this.user.course + " " + this.user.year+"-"+this.user.section;
      this.fullname = this.user.l_name + ", "+this.user.f_name;
      this.e_sig_path = this.user.e_sig;
    },
    err =>{

      console.log(err.error['message']);

    });
  }


  deleteMyAccount(){

    let u_id : string = this.user._id;
    var willDelete = window.confirm('Are you sure you want to delete?');

    if(willDelete){
      console.log("will delete: "+ u_id);
      this.adminService.deleteUser(u_id)
      .subscribe(result =>{


        window.alert("Your account was successfully deleted!");
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

      //realod
      if(res){

        window.location.reload();

      }



    });


  }

}
