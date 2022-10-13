import { Component, OnInit , Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { RestApiService } from './shared/rest-api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(public dialog: MatDialog,
    public restApi: RestApiService) {}
  title = 'Service Zone Tool';
  typesOfZone: any[] = [];
  totalZone: any[] = [];
  typesOfZip: any[] = [];
  divisionList: any[] = [];
  zipcodeListByZone: any[] = [];
  zone: any = {};
  zip: any = {};
  disableRemoveZone: boolean = true;
  disableRemoveNMoveZip: boolean = true;
  disableAddZip: boolean = true;
  selectDivision: number = 0;
  selectZone: string = '';
  selectZip: string = '';
  zoneDescription: string = '';
  zoneDetail: string = '';
  branch: number = 0;
  zoneName: string = '';
  ngOnInit(): void {
    this.getServiceZoneData();
  }
  getServiceZoneData(){
    this.getLookups();
    this.getZipcodeListByZoneId();
    this.getZip();
    this.getZone();
  }
  getLookups(){
    this.restApi.getDivisionNZipcodeList().subscribe((data: any) =>
    {
      this.divisionList = data.divisions;
    });
  }
  getZip(){
    let queryParam: number = 0;
    debugger;
    if(this.zone.id > 0){

      queryParam = this.zone.id;
    }
    else
    {
      queryParam = 0;
    }
    if(queryParam > 0)
    {
      this.restApi.getZipcodeList(queryParam).subscribe((data: any) =>
      {
        if(data != null){
          this.typesOfZip = data.zipcode
        }
        else{
          this.typesOfZip = [];
        }
      });
    }
    else{
        this.typesOfZip = [];
    }
  }
  getZipcodeListByZoneId(){
    let queryParam: number = 0;
    if(this.zone.id > 0 ){

      queryParam = this.zone.id;
    }
    else
    {
        queryParam = 0;
    }
    if(queryParam > 0)
    {
      this.restApi.getZipcodeListByZoneId(queryParam).subscribe((data: any) =>
      {
        if(data != null){
          debugger;
          this.zipcodeListByZone = data.zipcode
        }
        else{
          this.zipcodeListByZone = [];
        }
      });
    }
    else{
        this.zipcodeListByZone = [];
    }
  }
  getZone(){
    let queryParam: number = 0;
    if(this.branch == 0){
      queryParam = 0;
    }
    else
    {
      queryParam = this.branch;
    }
    this.restApi.getZoneList(queryParam).subscribe((data: any) =>
    {
      if(data != null)
      {
        this.typesOfZone = data.zone
        if(queryParam == 0){
          this.totalZone = this.typesOfZone;
        }
      }
      else{
        this.typesOfZone = [];
      }
    });
  }
  public branchChange(event: any){
    this.getZone();
  }
  public SelectZone(list: any){
    if(list != []){
      debugger;
      this.zone =  list._value[0];
      this.disableRemoveZone = false;
      this.disableAddZip = false;
      this.getZip();
      this.getZipcodeListByZoneId();
    }
  }
  public SelectZipCode(list: any) {
    if(list != []){
      this.zip =  list._value[0];
      this.disableRemoveNMoveZip = false;
    }
  }
  public addZone(){
    const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        data: {typtOfMessage: 'addZone', division: this.divisionList, selectDivision: this.selectDivision,  zoneDetail: this.zoneDetail, zoneDescription: this.zoneDescription},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != "" && result != undefined){
            debugger;
        if(result.selectDivision !='' && result.zoneDetail != '' && result.zoneDescription != ''){
          debugger;
          let body = {
              "divisionId": Number(result.selectDivision),
              "zoneDescription": result.zoneDetail,
              "description": result.zoneDescription,
              "active": true
          }
          this.restApi.postZone(body).subscribe((data: any) =>
          {
            debugger;
            if(data.serviceZone[0].successFlag == 1){
              const dialogRef = this.dialog.open(DialogComponent, {
                  width: '300px',
                  data: {message: 'Zone Added Successfully', typtOfMessage: 'Notification'},
              });
              this.getZone();
            }
            else{
              const dialogRef = this.dialog.open(DialogComponent, {
                    width: '300px',
                    data: {message: 'Sorry, Something went wrong! Please try again', typtOfMessage: 'Notification'},
              });
            }
          });
        }
        else{
          const dialogRef = this.dialog.open(DialogComponent, {
              width: '300px',
              data: {message: 'Please Enter the required fields', typtOfMessage: 'Notification'},
          });
        }
      }
    });

  }
  public removeZone(){
      const dialogRef = this.dialog.open(DialogComponent, {
            width: '300px',
            data: {message: 'Are you sure you want to remove a zone - '+ this.zone.zone +' ?', typtOfMessage: 'Confirm'},
      });
      dialogRef.afterClosed().subscribe(result => {
      if(result){
        let body = {
            "id": Number(this.zone.id),
            "isEdit": null
        }
        this.restApi.deletenEditZone(body).subscribe((data: any) =>
        {
         if(data.serviceZone[0].successFlag == 1){
           const dialogRef = this.dialog.open(DialogComponent, {
               data: {message: 'Zone Deleted Successfully!', typtOfMessage: 'Notification'},
           });
           this.zone = {};
    		   this.zip = {};
    		   this.disableRemoveZone = true;
    		   this.disableAddZip = true;
    		   this.disableRemoveNMoveZip = true;
           this.getServiceZoneData();
         }
        });
      }
    });
  }
  public editZone(){
    const dialogRef = this.dialog.open(DialogComponent, {
          width: '500px',
          data: {typtOfMessage: 'editZone', zoneDetail: this.zone, zoneName: this.zoneName},
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
    if(result){
      let body = {
          "id": Number(this.zone.id),
          "isEdit": 1,
          "zoneName": result.zoneName
      }
      this.restApi.deletenEditZone(body).subscribe((data: any) =>
      {
       if(data.serviceZone[0].successFlag == 1){
         const dialogRef = this.dialog.open(DialogComponent, {
             data: {message: 'Zone Updated Successfully!', typtOfMessage: 'Notification'},
         });
         this.zone.zone = result.zoneName;
         this.getServiceZoneData();
       }
      });
    }
  });
  }
  public addZip(){
    debugger

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {typtOfMessage: 'addZip', zipcodeList: this.zipcodeListByZone, selectZip: this.selectZip, zoneDetail: this.zone},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != "" && result != undefined){
      if(result.selectZone !=''){
        let body = {
            "zoneId": Number(this.zone.id),
            "zipcodeId": Number(result.selectZip),
        }
        this.restApi.postZip(body).subscribe((data: any) =>
        {
          if(data.zipcode[0].successFlag == 1){
            const dialogRef = this.dialog.open(DialogComponent, {
                  width: '300px',
                  data: {message: 'Zip Code Added Successfully', typtOfMessage: 'Notification'},
            });
            this.getServiceZoneData();
          }
          else{
            const dialogRef = this.dialog.open(DialogComponent, {
                  width: '300px',
                  data: {message: 'Sorry, Something went wrong! Please try again', typtOfMessage: 'Notification'},
            });
          }
        });
      }
      else{
        const dialogRef = this.dialog.open(DialogComponent, {
              width: '300px',
              data: {message: 'Please Enter the required fields', typtOfMessage: 'Notification'},
        });
      }
    }
  });
  }
  public removeZip(){
      const dialogRef = this.dialog.open(DialogComponent, {
            width: '300px',
            data: {message: 'Are you sure you want to remove a zip code - '+ this.zip.zipCode +'?', typtOfMessage: 'Confirm', selectedZip : this.zip},
      });
      dialogRef.afterClosed().subscribe(result => {
      if(result){
        let body = {
            "serviceId": Number(this.zip.serviceId)
        }

        this.restApi.deleteZip(body).subscribe((data: any) =>
        {
            debugger;
          if(data.zipcode[0].successFlag == 1){
            const dialogRef = this.dialog.open(DialogComponent, {
                data: {message: 'Zipcode Deleted Successfully!', typtOfMessage: 'Notification'},
            });
            this.zip = {};
            this.disableRemoveNMoveZip = true;
            this.getServiceZoneData();
          }
        });
      }
    });
  }
  public moveZip(){
    debugger;
    //filter total_zone

    let zoneList = this.totalZone.filter((a: any = this.totalZone) => a.id != this.zone.id);

    const dialogRef = this.dialog.open(DialogComponent, {
          width: '500px',
          data: {typtOfMessage: 'moveZip', zoneList: zoneList, selectZone: this.selectZone, zipDetail: this.zip},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != "" && result != undefined)
      {
        debugger;
        if(result.selectZone !=''){
          let body = {
              "serviceId": Number(this.zip.serviceId),
              "zoneId": Number(result.selectZone),
          }
          this.restApi.moveZip(body).subscribe((data: any) =>
          {
            if(data.zipcode[0].successFlag == 1){
              const dialogRef = this.dialog.open(DialogComponent, {
                    width: '300px',
                    data: {message: 'Zipcode Moved Successfully', typtOfMessage: 'Notification'},
              });
              this.disableRemoveNMoveZip = true;
              this.getServiceZoneData();
            }
            else{
              const dialogRef = this.dialog.open(DialogComponent, {
                    width: '300px',
                    data: {message: 'Sorry, Something went wrong! Please try again', typtOfMessage: 'Notification'},
              });
            }
            debugger;
              console.log(data);
          });
        }
        else{
          const dialogRef = this.dialog.open(DialogComponent, {
                width: '300px',
                data: {message: 'Please Enter the required fields', typtOfMessage: 'Notification'},
          });
        }
    }
    });
  }
}
