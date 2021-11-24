import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { EcrcreationService } from '../../../providers/ecrcreation.service';
import { ToastrService } from 'ngx-toastr';
import { Data, Router } from '@angular/router';
import { LoguserComponent } from './log.component';
import { DataService } from '../../../providers/share-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
 export class InboxComponent implements OnInit {
  dataSource = new MatTableDataSource<inboxData>();
  datasourceecr = new MatTableDataSource<inboxData>()
  constructor(private _ecrService: EcrcreationService,
    private toasterService: ToastrService,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private eventEmitterService: DataService ,
    private _router: Router) { }
  displayedColumns = ['ECRNumber', 'Description', 'CreationDate', 'EffectiveDate', 'SerialNumber', 'Status', 'PartNumber', 'RevisionNumber',
    'Requested', 'CatJobNumber', 'Type', 'Version', 'FileB','Remarks']
  displayedColumns1 = ['ECRNumber', 'Description', 'CreationDate', 'EffectiveDate', 'SerialNumber', 'Status', 'PartNumber', 'RevisionNumber',
    'Requested', 'CatJobNumber', 'Type', 'Version', 'log', 'FileB','Remarks']
  selectedFiles: string[] = [];
  dataList: any = [];
  isTable = true;
  isEdit = false;
  isMenue = true;
  ngOnInit() {
    this.getInbox();
    this.getEcrs();
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeFirstComponentFunction.subscribe((name:string) => {    
        this.getInbox();    
      });    
    }    

    // console.log(this.dataSource)
  }

  ecr: any = {
    "Id": 0,
    "ECRNumber": "",
    "Description": "",
    "EffectiveDate": "",
    "SerialNumber": "",
    "PartNumber": "",
    "RevisionNumber": "",
    "RequestedBy": "",
    "Files": "",
    "CatJobNumber": "",
    "ECRType": "",
    "UserName": "",
    "Version": "",
    "CurrentTimeStamp": Date,
    "ECRRelease": "",
    "isDisable": Boolean
  }
  fileDownload: any = {

    "Filename": "",
    "EcrNumber": "",
    "Version": 0
  }
  showUpdateForm(ecr) {
    if (ecr.SerialNumber == null) {
      ecr.SerialNumber = ""
    }
    this.ecr = { ...ecr.ecr };
    console.log(ecr.ecr.Status)
    if (ecr.ecr.Status != "routed") {
      this.isTable = false;
      this.isEdit = true;
      this.isMenue = false;
    }
    else {
      this.isTable = true;
      this.isEdit = false;
      this.isMenue = true;
    }
    this._router.navigate(['inbox'])

  }
  getLog(ecr) {

    localStorage.setItem("logData", ecr.ECRNumber)
    let dialogRef = this.dialog.open(LoguserComponent, {
      width: '90vw',
      height: '40vh',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(res => {

      if (res) { }

    });

  }



  getInbox() {
    this.spinnerService.show()
    this._ecrService.getInbox(localStorage.getItem("currentUser")).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.dataList = result.data;
          this.dataSource = new MatTableDataSource<any>(this.dataList);
          this.spinnerService.hide()
        }
        else {
          this.dataList = []
          this.spinnerService.hide()
        }

        (error) => {
          console.log("getInbox()", error)
          this.spinnerService.hide()
        }
      }
    )
    
  }
  addEcrCreation() {
    this._router.navigate(['ecrcreation'])
    this.getInbox();
    this.getEcrs();
  }
  downloadFiles(element) {
    this.fileDownload.Filename = element;
    this.fileDownload.EcrNumber = this.ecr.ECRNumber;
    this.fileDownload.Version = this.ecr.Version;

    this._ecrService.downloadSelectedFile(this.fileDownload).subscribe((data) => {
      let blob = new Blob();

      blob = new Blob([data]);

      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = element;
      link.click();

    });
    this.getInbox();
    this.getEcrs();
  }
  ecrlists: any = []
  getEcrs() {
    this._ecrService.getEcrs(localStorage.getItem('currentUser')).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ecrlists = result.data
          this.datasourceecr = new MatTableDataSource<any>(this.ecrlists);
        }
      }
    )
  }
}
export interface inboxData {
  ECRNumber: string,
  Description: string,
  CreationDate: string,
  EffectiveDate: string,
  SerialNumber: string,
  Status: string,
  PartNumber: string,
  RevisionNumber: string,
  RequestedBy: string,
  CatJobNumber: string,
  ECRType: string,
  Version: string,
  CurrentTimeStamp: Data,
  ECRRelease: string,
  Files: string,

}
