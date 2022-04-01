import { Component, OnInit, Input} from '@angular/core';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
@Input() name: string;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.name = this.userService.getToken();
  }

}
