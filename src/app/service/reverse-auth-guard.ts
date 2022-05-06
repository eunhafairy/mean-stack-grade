import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";


@Injectable()
export class ReverseAuthGuard implements CanActivate{
    
    constructor(private userService: UserService,private router:Router){}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
        const isAuth = this.userService.getAuth();
        if(isAuth){

            if(this.userService.getRole() === 'Student'){


              this.router.navigate(['/myrequest']);
            }
            else {
              this.router.navigate(['/faculty-request']);


            }
            return false;
        }
        return true;
    }

    

}