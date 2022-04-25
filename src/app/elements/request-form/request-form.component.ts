import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
//import WebViewer from '@pdftron/webviewer'
import { Request } from 'src/app/models/request';
import { RequestService } from 'src/app/service/request.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas'
import { PDFDocument } from 'pdf-lib'
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements AfterViewInit {

 isLoading = false;
  edit: boolean;
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
  // @ViewChild('viewer') viewerRef : ElementRef;


  constructor(  
    public dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Request,
    private requestService: RequestService,
    private userService: UserService,) { }
 
 
  ngAfterViewInit(): void {

    this.isLoading = true;

    //==============CREATE OR EDIT=================
    if(this.data.verdict){

      this.edit = true;

    }
    else{

      this.edit = false;

    }

    console.log("will edit?: " + this.edit);

    // ================== GET VALUES FROM DATA============================
        this.userService.getUser(this.data.user_id as string)
        .subscribe(res=>{

        console.log(res);
        this.e_sig_path = res['e_sig'];
          this.student_name = res['f_name'] + " " + res['l_name'];
          this.student_no = res['student_no'];
      
          this.userService.getUser(this.data.faculty_id as string)
          .subscribe(res =>{
      
            
            this.prof_name = res['f_name'] + " "+res['l_name'];
            this.e_sig_path_prof = res['e_sig'];
            this.acad_year2 = +this.data.year + 1;
            this.date_requested = new Date();
            this.date_accepted = new Date();
            this.isLoading = false;
      
      
          });
          
        });
        


   
 
  }


  clickBtn(){

      this.isLoading = true;
       setTimeout(()=>{this.fillForm()},3000);

  }
 

  readableDate(date : Date){

    return new Date(date).toLocaleDateString();

  }

  // 
  



async fillForm() {

 
  this.isLoading=true;
 
      if(this.edit){

      
        //get pdf form url
      const formUrl = this.data.request_form;
      const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

      //get professor signature
      const sigImageBytes = await fetch(this.e_sig_path_prof).then(res => res.arrayBuffer())

      //check image
      const checkImageBytes = await fetch('assets/files/check.png').then(res => res.arrayBuffer())
      

       //load pdf 
      const pdfDoc = await PDFDocument.load(formPdfBytes)

      //load image
      const sigImage = await pdfDoc.embedPng(sigImageBytes)
      const checkImage = await pdfDoc.embedPng(checkImageBytes);

      //get form
      const form = pdfDoc.getForm()

      const actionPassedField = form.getButton('action_passed')
      const actionFailedField = form.getButton('action_failed')
      const ratingFailedField = form.getTextField('rating_failed')
      const ratingPassedField = form.getTextField('rating_passed')
      const dateAcceptedField = form.getTextField('date_accepted')
      const professorSignatureImageField = form.getButton('prof_sig')

      if(this.data.verdict ==='5.00'){
        //failed
        actionFailedField.setImage(checkImage)
        ratingFailedField.setText(this.data.verdict)

      }
      else{
        
        actionPassedField.setImage(checkImage)
        ratingPassedField.setText(this.data.verdict)

      }

      dateAcceptedField.setText(this.readableDate(new Date()))
      professorSignatureImageField.setImage(sigImage)

      form.flatten();
      const pdfBytes = await pdfDoc.save();
  
      const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
      console.log("blob" +blob);
      //const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      var file = new File([blob], "Request_Form.pdf");

      this.requestService.updateRequest(this.data.request_id,this.data.subject,this.data.faculty_id, this.data.user_id, "Processing", this.data.creator, this.data.desc, new Date(this.data.dateRequested).toISOString(), new Date(), this.data.semester, this.data.year, this.data.note, this.data.cys, this.data.verdict, file).
      subscribe(res =>{
      
          this.isLoading = false;

        window.alert("Success!");
        this.dialogRef.close("Success");
      },
      err=>{
        window.alert("Error! "+err);    
      
        this.dialogRef.close();
      
      
      });

      

        

      }

     else{


      //get pdf form url
      const formUrl = "assets/files/Completion_Form_Fields.pdf";
      const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

      //getstudent signature
      const sigUrl = this.e_sig_path;
      console.log('png to: '+ this.e_sig_path);
      const sigImageBytes = await fetch(sigUrl).then(res => res.arrayBuffer())



      //load pdf 
      const pdfDoc = await PDFDocument.load(formPdfBytes)

      //load image
      const sigImage = await pdfDoc.embedPng(sigImageBytes)

      //get form
      const form = pdfDoc.getForm()

      //get name fields
      const studentNameField = form.getTextField('student_name')
      const professorNameField = form.getTextField('professor_name')
      const professorNameField2 = form.getTextField('prof_name2')
      const dateRequestedField = form.getTextField('dateRequested')
     
      const studIdField = form.getTextField('stud_id')
      const cysField = form.getTextField('cys')
      const subjectField = form.getTextField('subject')
      const semesterField = form.getTextField('semester')
      const year1Field = form.getTextField('year1')
      const year2Field = form.getTextField('year2')
      const reasonField = form.getTextField('reason')

      const studentSignatureImageField = form.getButton('student_sig')
      

      studentNameField.setText(this.student_name)
      professorNameField.setText(this.prof_name)
      professorNameField2.setText(this.prof_name)
      dateRequestedField.setText(this.readableDate(new Date()))
      studIdField.setText(this.student_no)
      cysField.setText(this.data.cys)
      subjectField.setText(this.data.subject)
      semesterField.setText(this.data.semester)
      year1Field.setText(this.data.year.toString())
      year2Field.setText((this.acad_year2).toString())
      reasonField.setText(this.data.desc)
      
      studentSignatureImageField.setImage(sigImage)
      const pdfBytes = await pdfDoc.save();
    
      const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
      console.log("blob" +blob);
      //const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      var file = new File([blob], "Request_Form.pdf");

      var now = new Date()
      this.requestService.addRequest(this.data.subject, this.data.user_id, this.data.faculty_id, "Requested", this.data.desc,this.data.creator, this.data.semester, this.data.year, this.data.cys, null, file).
      subscribe(res =>{
        this.isLoading = false;
    
        window.alert("Success!");
        this.dialogRef.close("Success");

      },
      err=>{
        window.alert("Error! "+err);
        this.dialogRef.close();

      });


      }
    }

  


}





      

    //----------------------------PDF LIB FILL FORM----------------------------------------


    //------------------------ WEB VIEWER (BACKUP) --------------------------------------
   
    // let pdfPath = 'assets/files/Completion_Form_Fields.pdf';
    // if(this.userService.getRole() != 'Student'){
    //   pdfPath = this.data.request_form;
    // }


          // WebViewer({
          //   path:'assets/lib',
          //   initialDoc: pdfPath,
            

          // },this.viewerRef.nativeElement)
          // .then(instance => {
          //   const { documentViewer, annotationManager } = instance.Core;


          //   //add custome button
          //   instance.UI.setHeaderItems(header => {
          //     header.push({
          //         type: 'actionButton',
          //         img: '...',
          //         onClick: async () => {
          //           const doc = documentViewer.getDocument();
          //           const xfdfString = await annotationManager.exportAnnotations();
          //           const data = await doc.getFileData({
          //             // saves the document with annotations in it
          //             xfdfString
          //           });
          //           const arr = new Uint8Array(data);
          //           const blob = new Blob([arr], { type: 'application/pdf' });
              
          //           // add code for handling Blob here
          //           var file = new File([blob], "blob_name.pdf");
          //           this.requestService.addRequest(this.data.subject, this.data.user_id, this.data.faculty_id, this.data.status, this.data.desc, this.data.creator, this.data.semester, this.data.year, this.data.cys, this.data.verdict, file).
          //           subscribe(res =>{
                    
          //             window.alert("Success!");
          //             window.location.reload();
          //           },
          //           err =>{

          //             console.log(err);
          //             window.alert("err!" + err);
          //           });
          //         }
          //     });
          //   });

          //   documentViewer.addEventListener('documentLoaded', () => {
          //     documentViewer.getAnnotationsLoadedPromise().then(() => {
                
          //       // iterate over fields
          //       const fieldManager = annotationManager.getFieldManager();
          //       fieldManager.forEachField(field =>{
                


          //         if(this.userService.getRole() === 'Student'){

          //           if(field.name !== "student_sig"){
  
          //             field.widgets.map(annot =>{ annot.fieldFlags.set('ReadOnly', true);})
          //           }

          //         }
          //         else if (this.userService.getRole() === 'Faculty'){
                    
          //           if(field.name !== "professor_sig"){
          //             field.widgets.map(annot =>{ annot.fieldFlags.set('ReadOnly', true);})
          //           }
          //           if(field.name === "professor_sig"){
          //             field.widgets.map(annot =>{ annot.fieldFlags.set('ReadOnly', true);})

          //           }

          //         }
                  
          //       });
          //       fieldManager.forEachField(field => {
          //         switch (field.name){

          //           case "professor_name":
          //             field.setValue(this.prof_name);
          //             //do something
          //             break;
          //           case "dateRequested":
          //             field.setValue(this.readableDate(new Date()));
          //             //do something
          //             break;
          //           case "student_name":
          //             field.setValue(this.student_name);
          //             //do something
          //             break;
          //           case "subject":
          //             field.setValue(this.data.subject);
          //             //do something
          //             break;
          //           case "semester":
          //             field.setValue(this.data.semester);
          //             //do something
          //             break;
          //           case "year1":
          //             field.setValue(this.data.year);
          //             //do something
          //             break;
          //           case "year2":
                    
          //             field.setValue(this.acad_year2);
          //             //do something
          //             break;
          //           case "reason":
          //            field.setValue(this.data.desc);
          //             //do something
          //             break;
          //           case "action_passed":

          //             if(this.data.verdict){
          //               if(this.data.verdict !== "5.00"){
          //                 field.setValue("✔");
          //               }
          //             }
                    
          //             //do something
          //             break;
          //           case "rating_passed":
          //             console.log("verdict is : "+this.data.verdict);
          //             if(this.data.verdict !== "5.00"){

          //               field.setValue(this.data.verdict);

          //             }

          //             //do something
          //             break;
          //           case "action_failed":
          //             if(this.data.verdict === "5.00"){

          //               field.setValue("✔");

          //             }
          //             //do something
          //             break;
          //           case "rating_failed":
          //             if(this.data.verdict === "5.00"){

          //               field.setValue(this.data.verdict);

          //             }
          //             //do something
          //             break;
          //           case "date_accepted":
          //             field.setValue(this.readableDate(new Date()));
          //             break;
          //           case "professor_sig":
          //             //do something
          //             break;
          //           case "professor_name2":
          //             field.setValue(this.prof_name);
          //             //do something
          //             break;
          //           case "student_sig":
          //             //do something
          //             break;
          //           case "stud_id":
          //             field.setValue(this.student_no);
          //             //do something
          //             break;
          //           case "cys":
          //             field.setValue(this.data.cys);
          //             //do something
          //             break;
          //         }
          //       });
          //     });
          //   });
          // });



         
           
          
              // Add header button that will get file data on click
           
         

  
    


  //----------------------CONVERT UNIT8ARRAY TO BLOB SYNTAX----------------------------------
  // const blob = new Blob([arr], { type: 'application/pdf' });




  //-----------------------------HTML TO CANVAS (NOT WORKING PROPERLY)----------------------------------
  // generatePDF(){
  //   let file;
  //   if(!this.edit){

  //     html2canvas(this.pdfRef.nativeElement,{
  
  //     useCORS: true
  
  //     }).then(canvas =>{
  
  //       var imgData = canvas.toDataURL('image/png');
  //       var doc = new jspdf.jsPDF('p', 'pt');
  //       doc.addImage(imgData, 0,0, 612, 791);
  //       file = doc.save("image.pdf");
  //     });

  //   }
  //   else{




  //   }
  

  // }



  //---------------------PDF LIB EMBED IMAGE(NOT WORKING) ---------------------

  // async embedImages() {



  //     //get form
  //     const formUrl = this.data.request_form;
  //     const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());
      
  //     //get signature png
  //     const sig = this.e_sig_path_prof;
  //     const sigImageBytes = await fetch(sig).then(res => res.arrayBuffer());
      
  //     //load doc
  //     const pdfDoc = await PDFDocument.load(formPdfBytes);
      
  //     //assign image
  //     const sigImage = await pdfDoc.embedJpg(sigImageBytes);
  //     const jpgDims = sigImage.scale(0.5)
  
  //     //get page and embed
  //     const page = pdfDoc.getPage(0);
  //     page.drawImage(sigImage, {
  //       x: page.getWidth() / 2 - jpgDims.width / 2,
  //       y: page.getHeight() / 2 - jpgDims.height / 2 + 250,
  //       width: jpgDims.width,
  //       height: jpgDims.height,
  //     })
  
  //     console.log('went here');
  //    const pdfBytes = await pdfDoc.save();
  //     pdfDoc.save();
  //    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  //    var file = new File([blob], "Request_Form.pdf");

  //    var now = new Date()
  //    console.log("date  requested : " +this.data.dateRequested);
  //    this.requestService.updateRequest(this.data.request_id, this.data.subject, this.data.faculty_id,this.data.user_id,
  //     "Processing", this.data.creator, this.data.desc, this.data.dateRequested, now, this.data.semester, this.data.year, this.data.note, this.data.cys, this.data.verdict,file).
  //    subscribe(res =>{
     
  //      window.alert("Success!");
  //      window.location.reload();
  //    },
  //    err=>{
  //      window.alert("Error! "+err);
  //    });
    
  
   

  // }

  //saveRequest(){


    //   if(!this.edit){
  
    //     html2canvas(this.pdfRef.nativeElement,{
    
    //     useCORS: true
    
    //     }).then(canvas =>{
    
    //       var imgData = canvas.toDataURL('image/png');
    //       var doc = new jspdf.jsPDF('p', 'pt');
    //       doc.addImage(imgData, 0,0, 612, 791);
    //       var blob = doc.output("blob");
    //       var file = new File([blob], "Request_Form.pdf");
    //       this.requestService.addRequest(this.data.subject, this.data.user_id, this.data.faculty_id, this.data.status, this.data.desc, this.data.creator, this.data.semester, this.data.year, this.data.cys, this.data.verdict, file).
    //       subscribe(res =>{
          
    //         window.alert("Success!");
    //         window.location.reload();
    //       },
    //       err=>{
    //         window.alert("Error! "+err);
    //       });
    //     });
  
    //   }
  
      
    // }