import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-validity-redirect',
  templateUrl: './validity-redirect.component.html',
  styleUrls: ['./validity-redirect.component.css']
})
export class ValidityRedirectComponent implements OnInit {

  status:string;
  user : User;
  constructor(private userService: UserService) { }
  ngOnInit(): void {


    //get logged in user
    this.userService.getUser(this.userService.getUserId())
    .subscribe(res=>{

      //success
      this.user = res as User;

      this.status = this.user.status;
    },
    err =>{

      //error
    


    });


  }

}
