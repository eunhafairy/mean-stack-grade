import { Component, OnInit, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'pdf-lib';
import { AddAccountComponent } from 'src/app/elements/add-account/add-account.component';
import { DialogChangePassComponent } from 'src/app/elements/dialog-change-pass/dialog-change-pass.component';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isLoading = false;
  user : any;
  fullname: string;
  cys: string;
  e_sig_path:string;
  requestNo : number = 0;
  pendingNo: number  = 0;
  completedNo: number  = 0;
requests:any[] =[];
  constructor(private userService: UserService,
    private adminService: AdminServiceService,
    private requestService: RequestService,
    private dialog: MatDialog) { }

  ngOnInit(): void {

    this.isLoading=true;
   this.userService.getUser(this.userService.getUserId())
    .subscribe(user => {

      this.user = user;
      this.cys = this.user.course + " " + this.user.year+"-"+this.user.section;
      this.fullname = this.user.l_name + ", "+this.user.f_name;
      this.e_sig_path = this.user.e_sig;
      this.requestService.getRequestByUserId(this.userService.getUserId())
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
          console.log(err);
          window.alert(err);


        }
      )
    },
    err =>{

      console.log(err.error['message']);

    });
  }


  deleteMyAccount(){

    let u_id : string = this.user._id;
    var willDelete = window.confirm('Are you sure you want to archive your account?');

    if(willDelete){
      console.log("will delete: "+ u_id);
      this.userService.updateUserStatus('Archive',u_id)
      .subscribe(result =>{


        window.alert("Your account was successfully archive!");
        this.userService.logout();


      },
      err=>{
        window.alert("Error: "+ err);
        console.log("archive error: " + error);
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
