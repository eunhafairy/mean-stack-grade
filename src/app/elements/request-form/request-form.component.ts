import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas'
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {

 
  e_sig_path: string;
  e_sig_path_prof: string;
  prof_name: string;
  student_name: string;
  date_requested: any;
  date_accepted: any;
  visibilityIfPass: string ;
  visibilityIfFail: string;
  student_no : string;
  acad_year2 : number;
  @ViewChild('pdfForm') pdfRef : ElementRef;


  constructor(  
    public dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormData,
    private userService: UserService,) { }

  ngOnInit(): void {

  
   this.userService.getUser(this.data.get('user_id') as string)
   .subscribe(res=>{

      this.e_sig_path = res['e_sig'];
 
      this.student_name = res['f_name'] + " " + res['l_name'];
      this.student_no = res['student_no'];

     
     this.date_requested = Date.parse(this.data.get('dateRequested').toString());
     this.date_accepted = Date.parse(this.data.get('dateAccepted').toString());
    

     console.log(this.data.get('verdict'));
     if(this.data.get('verdict') === '5.00'){
        this.visibilityIfPass= 'invisible'
        this.visibilityIfFail= 'visible'

     }
     else{    
       
      this.visibilityIfPass= 'visible'
     this.visibilityIfFail= 'invisible'

     }
     });

     this.userService.getUser(this.data.get('faculty_id') as string)
     .subscribe(res =>{

      this.prof_name = res['f_name'] + " "+res['l_name'];
      this.e_sig_path_prof = res['e_sig'];
 
     })

     this.acad_year2 = +this.data.get('year') + 1;

  }

  readableDate(date : Date){

    return new Date(date).toLocaleDateString();

  }

  generatePDF(){
    var file;
    html2canvas(this.pdfRef.nativeElement,{

    useCORS: true

    }).then(canvas =>{

      var imgData = canvas.toDataURL('image/png');
      var doc = new jspdf.jsPDF('p', 'pt');
      doc.addImage(imgData, 0,0, 612, 791);
      file = doc.save("image.pdf");
    });
   console.log(file);
  }


  // async afillForm() {
  //   const formUrl = 'pdfhost.io/v/EJX6at~8d_Completion_Form_Fields'
  //   const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
  //   const pdfDoc = await PDFDocument.load(formPdfBytes)
  
  //   const form = pdfDoc.getForm();
  
  //   const dateRequestedField = form.getTextField('dateRequested')
  //   const professor_nameField = form.getTextField('professor_name')
  //   const student_nameField = form.getTextField('student_name')
  //   const subjectField = form.getTextField('subject')
  //   const semesterField = form.getTextField('semester')
  //   const year1Field = form.getTextField('year1')
  //   const year2Field = form.getTextField('year2')
  //   const reasonField = form.getTextField('reason')
  //   const action_passedField = form.getTextField('action_passed')
  //   const rating_passedField = form.getTextField('rating_passed')
  //   const action_failedField = form.getTextField('action_failed')
  //   const rating_failedField = form.getTextField('rating_failed')
  //   const date_acceptedField = form.getTextField('date_accepted')
  //   //const professor_sigField = form.getSignature('professor_sig')
  //   const professor_name2Field = form.getTextField('professor_name2')
  //   //const student_sigField = form.getSignature('student_sig')

  //   const stud_idField = form.getTextField('stud_id')
  //   const cysField = form.getTextField('cys')


  
  //   dateRequestedField.setText('Mario')
  //   professor_nameField.setText('24 years')
  //   student_nameField.setText(`5' 1"`)
  //   subjectField.setText('196 lbs')
  //   semesterField.setText('blue')
  //   year1Field.setText('white')
  //   year2Field.setText('brown')
  //   reasonField.setText('brown')
  //   action_passedField.setText('brown')
  //   rating_passedField.setText('brown')
  //   action_failedField.setText('brown')
  //   rating_failedField.setText('brown')
  //   date_acceptedField.setText('brown')
  //   professor_name2Field.setText('brown')


  //   // student_sigField.setImage()
  //   // professor_sigField.setImage(marioImage)
  //   const pdfBytes = await pdfDoc.save()

   
  // }

  


}
