import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminServiceService } from 'src/app/service/admin-service.service';
import { UserService } from 'src/app/service/user.service';
import { Notif } from 'src/app/models/notif';
import { RequestService } from 'src/app/service/request.service';
import Swal from 'sweetalert2'

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
  desc: string;
  isLoading = false;
  noOfUnreadNotif: number;
  notifs : any =[];
  constructor(private userService: UserService, public router: Router, private requestService: RequestService) { }

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

      if(this.role !== 'Admin'){

        if(this.role === 'Faculty'){

          this.checkNotifFaculty();

        }
        else{

          this.checkNotif();

        }
      }




  }
  ngOnDestroy(): void {

    this.authListenerSubs.unsubscribe();
  }



  onLogout(){

    Swal.fire({
      title: 'Are you sure you want to logout?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5a68f0',
      cancelButtonColor: '#f05a5a',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.logout();
      }
    });



  }

  checkNotif(){

    this.requestService.getNotifByUserId(this.userService.getUserId())
    .subscribe(res=>{

      this.notifs = res['notifs'];
      console.log("notifs "+ res['notifs']);
      this.noOfUnreadNotif = res['notifs'].length;

    })

  }

  checkNotifFaculty(){

    this.requestService.getNotifByFacultyId(this.userService.getUserId())
    .subscribe(res=>{

      this.notifs = res['notifs'];
      this.noOfUnreadNotif = res['notifs'].length;

    })

  }







}
