import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {jsPDF} from 'jspdf'

declare var xepOnline : any;
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {

  @ViewChild('pdfForm', {static:false}) el!: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  downloadPDF(){

    let pdf = new jsPDF('p', 'px', 'letter');
    pdf.html(this.el.nativeElement, {
      callback: (pdf)=>{

        pdf.save("demo.pdf");

      }
    });
    
   
  }

}
