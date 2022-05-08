import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Notif } from 'src/app/models/notif';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  isLoading = false;
  notifs: any[]=[];
  constructor(private requestService: RequestService, private userService: UserService) { }


  ngOnInit(): void {

    this.getNotifs();
    

  }

  getNotifs(){
    
    this.isLoading = false;
    this.requestService.getNotifs();
    this.requestService.getNotifsUpdateListener()
    .subscribe(notifData => {
      this.transformNotifications(notifData.notifs);
    },
    err =>{

      window.alert(err);
      console.log(err);

    });

  }

  readableTime(date: Date){

    return new Date(date).toLocaleTimeString();

  }
    readableDate(date: Date){

    return new Date(date).toLocaleDateString();

  }

  deleteNotif(id :string){

    let willDelete = window.confirm('Are you sure you want to delete?');

    if(willDelete){

      this.requestService.deleteNotif(id)
      .subscribe(res=>{
      
        window.alert("Successfully deleted notification");
        window.location.reload();
      },
      err=>{
        window.alert(" delete notification failed");
        console.log(err);
  
      })

    }

  }

  private sortByDueDate(): void {
    this.notifs.sort((a: Notif, b: Notif) => {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();

    });
}

  transformNotifications(notifData : Notif[]){
    let temp = notifData;
    this.notifs = [];
    this.isLoading =true;
    for(let i= 0; i < temp.length; i++){

     
      let _studentID = temp[i].user_id;
      let _facultyID = temp[i].faculty_id;
      

        this.userService.getUser(_studentID)
        .subscribe(
          res=>{
          
    
            temp[i].user_id =  res['f_name'] + " " + res['l_name'];

            this.userService.getUser(_facultyID)
            .subscribe(res=>{

              temp[i].faculty_id =  res['f_name'] + " " + res['l_name'];
              
              switch(temp[i].type){
                  case "Create":
                    temp[i].desc = "You created a completion request form for the subject "+ temp[i].subject +" to "+ temp[i].faculty_id;
                    break;
                  case "Reject":
                    temp[i].desc = temp[i].faculty_id +  " rejected your completion request form for the subject "+ temp[i].subject;
                    break;
                  case "Processing":
                    temp[i].desc = "Your completion request form for the subject "+ temp[i].subject +" to "+ temp[i].faculty_id + " is now processing";
                    break;
                  case "Completed":
                    temp[i].desc = "Your completion request form for the subject "+ temp[i].subject +" to "+ temp[i].faculty_id + " is now completed. Congrats!";
                    break;

              }

              
              if(_studentID === this.userService.getUserId() || _facultyID === this.userService.getUserId()){
                
                this.notifs.push(temp[i]);
                
              }
              
              if((i+1) === temp.length){
                  this.sortByDueDate();

                //read all notifs
                for(let i = 0; i < this.notifs.length; i++){

                  this.requestService.readNotif(this.notifs[i]._id)
                  .subscribe(res=>{

                    console.log('successfully read');


                  }, err=>{
                    console.log('failed read');


                  })

                }

                this.isLoading = false;

              }
            

            })

            
          },
          err=>{

            this.isLoading = false;

            console.log("error " +err);
          }
        )



    }
    



  }


}
