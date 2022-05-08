import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyGuard implements CanActivate {

  status : boolean;
  constructor(private userService: UserService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if(this.userService.getRole() ==='Faculty'){

      console.log("validity status: " + this.userService.getStatus());
      if(this.userService.getStatus() !== 'Accepted'){

      this.router.navigate(['/validity-redirect']);
      return false;

      }
      else{
        return true;
      }

    

    }
    else if(this.userService.getRole() ==='Student'){
      this.router.navigate(['/myrequest']);
      return false;
    }
    else{
        this.router.navigate(['/admin-dashboard']);
        return false;

    }

    
    
  }
}
