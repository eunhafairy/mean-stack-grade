import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  title: string = '';
  user_id: string = '';
  faculty_id: string = '';
  status: string = 'Requested';


  constructor(public requestService: RequestService, public router: Router) { }

  ngOnInit(): void {
  }

  createRequest(postForm: NgForm){
    if(postForm.invalid){
      return;
    }

    this.requestService.addRequest( postForm.value.title, postForm.value.user_id ,postForm.value.faculty_id,this.status);

    postForm.resetForm();
    window.alert('Request added!');
    this.router.navigate(["/dashboard"]);
  }


}
