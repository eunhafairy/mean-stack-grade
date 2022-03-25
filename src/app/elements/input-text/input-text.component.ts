import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent implements OnInit {

@Input() placeholder?: string;
@Input() type?: string;
  constructor() { }

  ngOnInit(): void {
  }

}
