import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Request } from 'src/app/models/request';
import { User } from 'src/app/models/user';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';
import { DialogRejectRequestComponent } from '../dialog-reject-request/dialog-reject-request.component';
import { DialogRequestVerdictComponent } from '../dialog-request-verdict/dialog-request-verdict.component';
import { RequestFormComponent } from '../request-form/request-form.component';

@Component({
  selector: 'app-faculty-request-element',
  templateUrl: './faculty-request-element.component.html',
  styleUrls: ['./faculty-request-element.component.css']
})
export class FacultyRequestElementComponent implements OnInit {

  @Input() status:string;
  requests : any[] = [];
  acadYear : string;
  totalRequests: number;
  dataSource: any;
  isLoading = false;
  pageSizeOptions : number[];
  private requestSub: Subscription = new Subscription;

  constructor(private requestService: RequestService, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    
    this.refreshTable();
  }


  refreshTable(){

    this.isLoading = true;
    console.log(this.status);
    this.requestService.getRequestByStatus(this.status)
    .subscribe(response =>{
       this.isLoading=false;
       this.transformRequests(response['requests']);
    });
  }

  
  readableDate(date : Date){

    return new Date(date).toLocaleDateString();

  }

  getUserSection(id : string){

    this.userService.getUser(id).subscribe(res=>{



    })

  }

  transformAcadYear(year: number){
    
    return "20"+year+"-"+"20"+(year+1); 
  }

  transformRequests(request:Request[]){

    
    this.requests = [];
    for(let i = 0; i < request.length; i++){

      console.log(request[i].faculty_id + " and " + this.userService.getUserId() );
      if(request[i].faculty_id === this.userService.getUserId()){

        this.requests.push(request[i]);

      }
    
     

    }

     
  

    for(let i = 0; i < this.requests.length; i++){

    this.userService.getUser(this.requests[i].user_id)
    .subscribe(responseData =>{

      this.requests[i].user_id = responseData['l_name'] + ", "+ responseData['f_name'];

      this.isLoading=false;


    });

    this.userService.getUser(this.requests[i].faculty_id)
    .subscribe(responseData =>{

      this.requests[i].faculty_id = responseData['l_name'] + ", "+ responseData['f_name'];
      this.isLoading=false;

    });
    
     

    }

   
   

  }

  acceptRequest(id: string) : void{
    const dialogRef = this.dialog.open(DialogRequestVerdictComponent, {
      width: '80%',
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      if(result){
        
        const dialogRef = this.dialog.open(RequestFormComponent, {
           data: result,
             height: '90%',
              width: '80%',
        });
        dialogRef.afterClosed().subscribe(result =>{
          window.location.reload();
          this.refreshTable();
        })

        
      }
      else{
        
        window.location.reload();
        this.refreshTable();
        
      }
    });
  }
  rejectRequest(id: string){

    const dialogRef = this.dialog.open(DialogRejectRequestComponent, {
      width: '80%',
      data: id
    });

    dialogRef.afterClosed().subscribe((res) => {
  
      if(res === "Success"){
        window.location.reload();
      }
     
    });
      
  }

}



  

  // @Component({
  //   selector: 'faculty-verdict-element',
  //   templateUrl: 'faculty-verdict-element.html',
  //    styleUrls: ['./faculty-request-element.component.css']
  // })
  // export class FacultyVerdictElement implements OnInit {
  
  //   form : FormGroup;
  //  isLoading = false;
  //  selectedVerdict: string;
  //  selectedAction :string;
  //  verdicts : any = [
  //     {value: '1.00'},
  //     {value: '1.25'},
  //     {value: '1.50'},
  //     {value: '1.75'},
  //     {value: '2.00'},
  //     {value: '2.25'},
  //     {value: '2.50'},
  //     {value: '2.75'},
  //     {value: '3.00'}
  //  ];
  //  actions: any = [
  //   {value: 'Passed'},
  //   {value: 'Failed'},   
    
  //  ]
  
  //   constructor(
  //     public dialogRef: MatDialogRef<FacultyVerdictElement>,
  //     @Inject(MAT_DIALOG_DATA) public data: Request,
  //     private requestService : RequestService
  //   ) {

     

  //   }
  //   ngOnInit(): void {
     
  //   this.form = new FormGroup({
  //     'action': new FormControl(null, {validators: [Validators.required]}),
  //     'verdict': new FormControl(null, {validators: [Validators.required]})
     
  //     });

  //     this.form.patchValue({action : 'Passed'});
  //     this.selectedAction = 'Passed'
   
  //   }
  
  //   onNoClick(): void {
  //     this.dialogRef.close();
  //   }

  //   onSubmit(){

  //     console.log(this.data.subject);
  //     console.log(this.selectedVerdict);
  //   }


  //   public findInvalidControls() {
  //     const invalid = [];
  //     const controls = this.form.controls;
  //     for (const name in controls) {
  //         if (controls[name].invalid) {
  //             invalid.push(name);
  //         }
  //     }
  //     return invalid;
  //   }
  
  
    
  
  //   }
  