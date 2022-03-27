import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { Request } from 'src/app/models/request';
import { RequestComponent } from 'src/app/elements/request/request.component';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  title: string = '';
  user_id: string = '';
  imagePreview: string;
  faculty_id: string = '';
  status: string = 'Requested';
  private mode = 'create';
  public requestId : string = '';
  request?: any = [];
  selectedStatus:string = '';
  fileTitle: string;
  isLoading = false;
  form: FormGroup;

  public stats: any = [
    {value : "Requested"}, 
    {value: "Accepted"}, 
    {value: "Revised"}];

  constructor(public requestService: RequestService, public router: Router, public activeRoute: ActivatedRoute) { }




  ngOnInit(): void {

    this.fileTitle = "No file selected."

   this.form = new FormGroup({
      '__title': new FormControl(null, {validators: [Validators.required]}),
      '__user_id' : new FormControl(null, {validators: [Validators.required]}),
      '__faculty_id' : new FormControl(null, {validators: [Validators.required]}),
      '__status' : new FormControl('Requested', {validators: [Validators.required]}),
      '__file' : new FormControl(null)
  });
  

  //=========== CHECK IF CREATE OR EDIT=================
  this.activeRoute.paramMap.subscribe((paramMap : ParamMap) => {



    //===============TO EDIT=================
      if(paramMap.has('requestId')){
          this.mode = 'edit';
          this.requestId = paramMap.get('requestId') as string;

          this.isLoading= true;
          this.requestService
          .getRequest(this.requestId)
          .subscribe( requestData => {
              this.isLoading= false;
              this.request = {
                request_id : requestData._id,
                title: requestData.title,
                user_id: requestData.user_id,
                faculty_id: requestData.faculty_id,
                status: requestData.status ,
                filePath: requestData.filePath 
              }
            this.form.setValue({
                __title: this.request.title,
                __user_id: this.request.user_id,
                __faculty_id: this.request.faculty_id,
                __status: this.request.status,
                __file : this.request.filePath

            });

          });
          this.selectedStatus = this.request.status;
      }

      //===============TO CREATE=================
      else{
        this.mode = 'create'
        this.requestId = '';
        this.selectedStatus = this.stats[0].value;
    
        
      }

    });
  }

  //===============SAVING REQUEST=================
  onSaveRequest(){

    //===============CHECK IF FORM IS VALID=================
    if(this.form.invalid){
      return;
    }

    this.isLoading = true;

    //===============CREATE=================
    if (this.mode === "create"){
      this.requestService.addRequest( this.form.value.__title, this.form.value.__user_id , this.form.value.__faculty_id,  this.form.value.__status, this.form.value.__file);
      window.alert('Request added!');
    }

    //===============UPDATE=================
    else{
      this.requestService.updateRequest(this.requestId,  this.form.value.__title,  this.form.value.__user_id , this.form.value.__faculty_id,  this.form.value.__status, this.form.value.__file);
      window.alert('Request updated!');
    }

    this.form.reset();
    this.router.navigate(["/dashboard"]);
  }


  //===============SAVE FILE=================
  onFilePicked(event: Event){

      const file = (event.target as HTMLInputElement).files[0];
      this.fileTitle = file.name;
      this.form.patchValue({__file : file});
      this.form.get('__file').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () =>{
          this.imagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);

  }


}
