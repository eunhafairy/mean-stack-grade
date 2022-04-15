import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-faculty-request',
  templateUrl: './faculty-request.component.html',
  styleUrls: ['./faculty-request.component.css']
})
export class FacultyRequestComponent implements OnInit {

  @Input() status:string;
  constructor() { }

  ngOnInit(): void {
  }

  

}
