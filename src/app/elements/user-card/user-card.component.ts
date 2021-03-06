import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() status : string;
  public users : User[] = [];
  private userSub: Subscription = new Subscription;
  isLoading = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.userService.getUserByStatus(this.status)
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

        window.alert("User successfully restored!");
        window.location.reload();

      },
      err=>{

        window.alert("Error occured. "+err);
        console.log('update status failed '+ err);

      }
    );

  }

}
