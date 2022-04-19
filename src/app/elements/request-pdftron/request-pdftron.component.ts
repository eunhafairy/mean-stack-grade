import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import WebViewer from '@pdftron/webviewer';
import { PDFNet } from '@pdftron/pdfnet-node';
@Component({
  selector: 'app-request-pdftron',
  templateUrl: './request-pdftron.component.html',
  styleUrls: ['./request-pdftron.component.css']
})
export class RequestPdftronComponent implements AfterViewInit {


  @ViewChild('viewer')
  viewerRef!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<RequestPdftronComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormData) { }
  
  ngAfterViewInit(): void {
  
    WebViewer({

      path:'../assets/lib',
      initialDoc: '../assets/files/Completion_Form.pdf'


    }, this.viewerRef.nativeElement);


  }


  async myFunc(){
    const doc = await PDFNet.PDFDoc.createFromURL('../assets/files/Completion_Form.pdf');
    // Search for a specific field
    const field = await doc.getField("employee.name.first");
    await field.setValueAsString("John");

  }
}
