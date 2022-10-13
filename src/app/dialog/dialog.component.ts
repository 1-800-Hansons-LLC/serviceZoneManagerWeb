import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {
    type_name: string = '';
    division : any[]= [];
    zoneList : any[]= [];
    zipList :  any[] = [];
    zoneDetail = {
      zone: '',
      division: ''
    };
    zipDetail = {
      zipcode: ''
    }
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
          this.type_name = data.typtOfMessage;
          this.division = data.division;
          debugger;

          this.zipList = data.zipcodeList;
          if(data.typtOfMessage == "addZip")
          {
            this.zoneDetail.zone = data.zoneDetail.zone;
            this.zoneDetail.division = data.zoneDetail.division;
          }
          this.zoneList = data.zoneList;
          if(data.typtOfMessage == "moveZip"){
            this.zipDetail.zipcode = data.zipDetail.zipCode;
          }
    }

  ngOnInit(): void {

  }

}
