
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent implements OnInit {

  @Input() status : string;
  public users : User[] = [];
  private userSub: Subscription = new Subscription;
  isLoading = false;
  constructor(private userService: UserService, private adminService: AdminServiceService) { }

  ngOnInit(): void {


    this.isLoading = true;
    this.adminService.getFacultyByStatus(this.status)
    .subscribe((userData) => {
      this.isLoading = false;
      console.log(userData['users']);
      this.users = userData['users'];
    },
    err =>{
      console.log(err);
    });


  }

  getFullName(fName: string, lName: string){

      return lName +", "+fName;
  }

  acceptFaculty(user: any, verdict : string){


    if(verdict === 'pending'){

      verdict = 're-appeal'

    }
    //accept faculty here
    let yes = window.confirm("Are you sure you want to " + verdict + " this faculty account validity?");

    if(yes){

      if(verdict === 'Appeal'){
        verdict = "Pending"

      }
      else if (verdict === "Accept"){
        verdict = "Accepted"

      }
      else {

        verdict = "Rejected"

      }


      this.userService.updateUser(user._id, user.f_name, user.l_name, user.email, user.role, user.e_sig, user.student_no, verdict, user.course, user.year, user.section)
      .subscribe(
        res=>{

          // window.alert("Faculty successfully updated!");
          Swal.fire({
            icon: 'success',
            title: 'Yehey!',
            text: 'Faculty successfully updated!',
            allowOutsideClick: false
          })


          window.location.reload();

        },
        err=>{

          // window.alert("Error! " + err);
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: err + "!",
            allowOutsideClick: false
       })


        }
      )


    }

  }

  restoreAccount(user: any){

    let id = user._id;
    let status: string;

    if(user.role === 'Faculty'){
      status = 'Accepted';
    }
    else{
      status = 'Pending';

    }

    this.userService.updateUserStatus(status, id)
    .subscribe(
      res =>{

        // window.alert("User successfully restored!");
        Swal.fire({
          icon: 'success',
          title: 'Yehey!',
          text: 'User successfully restored!',
          allowOutsideClick: false
      })
        window.location.reload();

      },
      err=>{

        // window.alert("Error occured. "+err);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: err + "!",
          allowOutsideClick: false
        })
        // console.log('update status failed '+ err);

      }
    );

  }

}
