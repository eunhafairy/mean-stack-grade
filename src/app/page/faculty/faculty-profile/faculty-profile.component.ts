import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.css']
})
export class FacultyProfileComponent implements OnInit {

  fullname:string;
  e_sig_path:string;
  user: any;

  constructor(private userService: UserService, private adminService: AdminServiceService) { }

  ngOnInit(): void {

    this.userService.getUser(this.userService.getUserId())
    .subscribe(user => {

      
      this.user = user;
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
  
  editMyAccount(){


  }

}
