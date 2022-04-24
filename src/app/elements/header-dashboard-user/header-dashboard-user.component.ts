import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-header-dashboard-user',
  templateUrl: './header-dashboard-user.component.html',
  styleUrls: ['./header-dashboard-user.component.css']
})
export class HeaderDashboardUserComponent implements OnInit, OnDestroy{

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  role :string;
  status : string;
  constructor(private userService: UserService, public router: Router) { }
  
  ngOnInit(): void {


     
      this.userIsAuthenticated = this.userService.getAuth();
      this.authListenerSubs = this.userService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {

        this.userIsAuthenticated = isAuthenticated;
      
       
      });

      if(this.userIsAuthenticated){

        this.role = this.userService.getRole();
  
        this.userService.getUser(this.userService.getUserId())
        .subscribe(res=>{
  
          this.status = (res as User).status;
  
        })

      }
      
    

  }
  ngOnDestroy(): void {

    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
      
    this.userService.logout();
   

  }

  


}
