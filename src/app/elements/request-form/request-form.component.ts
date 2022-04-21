import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import WebViewer from '@pdftron/webviewer'
import { Request } from 'src/app/models/request';
import { RequestService } from 'src/app/service/request.service';
// import * as jspdf from 'jspdf';
// import html2canvas from 'html2canvas'
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements AfterViewInit {

 
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
  //@ViewChild('pdfForm') pdfRef : ElementRef;
  @ViewChild('viewer') viewerRef : ElementRef;


  constructor(  
    public dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Request,
    private requestService: RequestService,
    private userService: UserService,) { }
 
 
  ngAfterViewInit(): void {

    // WebViewer({

    //   path:'assets/lib',
    //   initialDoc:'assets/files/Completion_Form_Fields.pdf'

    // }, this.viewerRef.nativeElement).then();

    // ================== GET VALUES FROM DATA============================


    this.userService.getUser(this.data.user_id as string)
       .subscribe(res=>{

          this.e_sig_path = res['e_sig'];

          this.student_name = res['f_name'] + " " + res['l_name'];
          this.student_no = res['student_no'];
          
        
         });

    this.userService.getUser(this.data.faculty_id)
    .subscribe(res =>{

    this.prof_name = res['f_name'] + " "+res['l_name'];
    this.e_sig_path_prof = res['e_sig'];

    })

    this.acad_year2 = +this.data.year + 1;
    
    console.log("verdict is  "+ this.data.verdict);

    let pdfPath = 'assets/files/Completion_Form_Fields.pdf';
    if(this.userService.getRole() != 'Student'){
      pdfPath = this.data.request_form;
    }


          WebViewer({
            path:'assets/lib',
            initialDoc: pdfPath,
            

          },this.viewerRef.nativeElement)
          .then(instance => {
            const { documentViewer, annotationManager } = instance.Core;


            //add custome button
            instance.UI.setHeaderItems(header => {
              header.push({
                  type: 'actionButton',
                  img: '...',
                  onClick: async () => {
                    const doc = documentViewer.getDocument();
                    const xfdfString = await annotationManager.exportAnnotations();
                    const data = await doc.getFileData({
                      // saves the document with annotations in it
                      xfdfString
                    });
                    const arr = new Uint8Array(data);
                    const blob = new Blob([arr], { type: 'application/pdf' });
              
                    // add code for handling Blob here
                    var file = new File([blob], "blob_name.pdf");
                    this.requestService.addRequest(this.data.subject, this.data.user_id, this.data.faculty_id, this.data.status, this.data.desc, this.data.creator, this.data.semester, this.data.year, this.data.cys, this.data.verdict, file).
                    subscribe(res =>{
                    
                      window.alert("Success!");
                      window.location.reload();
                    },
                    err =>{

                      console.log(err);
                      window.alert("err!" + err);
                    });
                  }
              });
            });

            documentViewer.addEventListener('documentLoaded', () => {
              documentViewer.getAnnotationsLoadedPromise().then(() => {
                
                // iterate over fields
                const fieldManager = annotationManager.getFieldManager();
                fieldManager.forEachField(field =>{
                


                    if(field.name !== "student_sig"){
  
                      field.widgets.map(annot =>{
  
                        annot.fieldFlags.set('ReadOnly', true);
  
                      })
  
                    

                  }
                  
                });
                fieldManager.forEachField(field => {
                  switch (field.name){

                    case "professor_name":
                      field.setValue(this.prof_name);
                      //do something
                      break;
                    case "dateRequested":
                      field.setValue(this.readableDate(new Date()));
                      //do something
                      break;
                    case "student_name":
                      field.setValue(this.student_name);
                      //do something
                      break;
                    case "subject":
                      field.setValue(this.data.subject);
                      //do something
                      break;
                    case "semester":
                      field.setValue(this.data.semester);
                      //do something
                      break;
                    case "year1":
                      field.setValue(this.data.year);
                      //do something
                      break;
                    case "year2":
                    
                      field.setValue(this.acad_year2);
                      //do something
                      break;
                    case "reason":
                     field.setValue(this.data.desc);
                      //do something
                      break;
                    case "action_passed":

                      if(this.data.verdict){
                        if(this.data.verdict !== "5.00"){
                          field.setValue("l");
                        }
                      }
                    
                      //do something
                      break;
                    case "rating_passed":
                      if(this.data.verdict !== "5.00"){

                        field.setValue(this.data.verdict);

                      }

                      //do something
                      break;
                    case "action_failed":
                      if(this.data.verdict === "5.00"){

                        field.setValue("l");

                      }
                      //do something
                      break;
                    case "rating_failed":
                      if(this.data.verdict === "5.00"){

                        field.setValue(this.data.verdict);

                      }
                      //do something
                      break;
                    case "date_accepted":
                      //do something
                      break;
                    case "professor_sig":
                      //do something
                      break;
                    case "professor_name2":
                      field.setValue(this.prof_name);
                      //do something
                      break;
                    case "student_sig":
                      //do something
                      break;
                    case "stud_id":
                      field.setValue(this.student_no);
                      //do something
                      break;
                    case "cys":
                      field.setValue(this.data.cys);
                      //do something
                      break;
                  }
                });
              });
            });
          });



         
           
          
              // Add header button that will get file data on click
           
         

  
    
  }

 

  readableDate(date : Date){

    return new Date(date).toLocaleDateString();

  }

  // generatePDF(){
  //   var file;
  //   html2canvas(this.pdfRef.nativeElement,{

  //   useCORS: true

  //   }).then(canvas =>{

  //     var imgData = canvas.toDataURL('image/png');
  //     var doc = new jspdf.jsPDF('p', 'pt');
  //     doc.addImage(imgData, 0,0, 612, 791);
  //     file = doc.save("image.pdf");
  //   });
  //  console.log(file);
  // }


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
