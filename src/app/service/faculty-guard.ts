import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if(this.userService.getRole() ==='Faculty'){
      return true;
    }
    else if(this.userService.getRole() ==='Student'){
      this.router.navigate(['/dashboard']);
      return false;
    }
    else{
        this.router.navigate(['/admin-dashboard']);
        return false;

    }

    
    
  }
}
