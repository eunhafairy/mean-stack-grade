import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DialogAddSubjectComponent } from 'src/app/elements/dialog-add-subject/dialog-add-subject.component';
import { Subjects } from 'src/app/models/subjects';
import { AdminServiceService } from 'src/app/service/admin-service.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit  {

  _filter:string;
  public subjects : Subjects[]=[];
  private subjectSub: Subscription = new Subscription;
  totalSubjects = 0;
  subjectsPerPage = 5;
  currentPage = 1;
  pageSizeOptions : number[] ;
  displayedColumns : string[] = ['subject_code', 'subject_name', 'subject_description', 'action']
  isLoading = false;
  resultsLength = 0;
  dataSource: MatTableDataSource<Subjects>;

  //sort
  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private adminService: AdminServiceService, private dialog: MatDialog) {


   }
  ngOnInit(): void {
    this.refreshTable();

  }


  setPageSizeOption(){

    if( this.dataSource.data.length > 10){
      this.pageSizeOptions =  [1, 2, 5,  10, this.dataSource.data.length];
    }
    else{
      this.pageSizeOptions =  [1, 2, 5, 10];
    }
    this.paginator.pageSize= this.dataSource.data.length;
  }

  applyFilter(event: Event){

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  openDialog(){

    const dialogRef = this.dialog.open(DialogAddSubjectComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      console.log(result);
      this.refreshTable();
    });


  }

  editDialog(subject: Subjects){

    const dialogRef = this.dialog.open(DialogAddSubjectComponent, {
      data: subject
    });

    dialogRef.afterClosed().subscribe(result => {
      //after closing dialog, refresh the table
      console.log(result);
      this.refreshTable();
    });

  }

  //refresh table data
  refreshTable(){

    this.isLoading = true;
    this.adminService.getSubjects();
    this.adminService.getSubjectsUpdateListener()
    .subscribe(subjectData => {
      this.isLoading = false;
      console.log(JSON.stringify(subjectData))
      this.subjects = subjectData.subjects;
      this.dataSource = new MatTableDataSource(this.subjects);
      this.setPageSizeOption();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    err =>{


      window.alert(err);
console.log(err);

    });



  }


  //show all data
  showAll(){
    this.refreshTable();
    this.paginator.pageSize = this.dataSource.data.length;

  }


  //delete a subject
  deleteSubject(id:string){

    let willDelete = window.confirm("Are you sure you want to delete?");
    if(willDelete){
      this.adminService.deleteSubject(id)
      .subscribe(result =>{

        console.log(result);
        this.refreshTable();


      },
      error =>{


        window.alert(error);
        this.refreshTable();

      });
    }
    else{

      return;
    }


  }


  //edit a subject
  editSubject(subject: Subjects ){


        // const dialogRef = this.dialog.open(CreateSubjectDialog, {
        //   width: '80%',
        //   data: subject
        // });

        // dialogRef.afterClosed().subscribe(result => {
        // //  this.refreshTable();
        // });

  }

}



//---------------create subject dialog-------------------------

// @Component({
//   selector: 'create-subject-dialog',
//   templateUrl: 'create-subject-dialog.html',
//    styleUrls: ['./subjects.component.css']
// })
// export class CreateSubjectDialog implements OnInit {

//   @ViewChild('subjectCode', {static:true}) subjCodeInput : NgModel;
//   isLoading = false;
//   mode: string;


//   constructor(
//     public dialogRef: MatDialogRef<CreateSubjectDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: Subjects,
//     private adminService: AdminServiceService
//   ) {

//     if (this.data){

//       this.mode = 'edit';

//      }
//      else{
//        this.mode = 'create';

//      }

//   }

//   ngOnInit(): void {

//   }

//   onNoClick(): void {

//     this.dialogRef.close();

//   }

//   onCreateSubject(form: NgForm){


//     this.isLoading = true;

//     if(form.invalid){
//       return;
//     }

//     if(this.mode == "create"){

//       this.adminService.createSubject(form.value.subjectCode,form.value.subjectName, form.value.subjectDesc)
//       .subscribe(

//         (response)=>{

//           //success
//           console.log(response);
//           window.alert("Success!");
//           this.isLoading = false;
//           this.dialogRef.close("Success");
//         },

//         (error) =>{

//           //error
//         window.alert(error);
//         this.isLoading = false;
//         this.dialogRef.close("Failed");

//       });

//     }
//     else{

//       this.adminService.updateSubject(this.data)
//       .subscribe(
//         response =>{

//           window.alert("User udpated!");
//           this.isLoading = false;
//           this.dialogRef.close();
//         },
//         error =>{

//           window.alert(error);
//           this.isLoading = false;
//         }
//       );;


//     }





//   }
// }


