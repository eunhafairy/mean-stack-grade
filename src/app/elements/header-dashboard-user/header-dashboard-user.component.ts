import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-header-dashboard-user',
  templateUrl: './header-dashboard-user.component.html',
  styleUrls: ['./header-dashboard-user.component.css']
})
export class HeaderDashboardUserComponent implements OnInit, OnDestroy{

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private userService: UserService, public router: Router) { }
  
  ngOnInit(): void {


     
      this.userIsAuthenticated = this.userService.getAuth();
      this.authListenerSubs = this.userService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {

        this.userIsAuthenticated = isAuthenticated;

      });
      
    

  }
  ngOnDestroy(): void {

    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
      
    this.userService.logout();
   

  }


}
