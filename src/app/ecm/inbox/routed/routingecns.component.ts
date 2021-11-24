import { Component, OnInit } from '@angular/core';
import { EcrcreationService } from '../../../../providers/ecrcreation.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Data, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { QualityuserComponent } from './user.component';
import { DataService } from '../../../../providers/share-data.service';
import { NgForm } from '@angular/forms';
import { ProcedureService } from '../../../../providers/procedure.service';
import Swal from 'sweetalert2';
import { ExcelService } from '../../../../providers/excel.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-routingecns',
  templateUrl: './routingecns.component.html',
  styleUrls: ['./routingecns.component.css']
})
export class RoutingecnsComponent implements OnInit {
  dataSource = new MatTableDataSource<inboxData>();
  user: string;
  isTable = true;
  isEdit = false;
  isApprove: boolean;
  progressvalue:number;
  progressMessage:string;
  selectedImages;
  selectedCsvs;

  constructor(private _ecrService: EcrcreationService,
    breakpointObserver: BreakpointObserver,
    private _router: Router,
    public dialog: MatDialog,
    private toasterService: ToastrService,
    private toastr: ToastrService,
    private _procedureService: ProcedureService,
    private spinnerService: Ng4LoadingSpinnerService,
    private _excelService: ExcelService,
    private shared: DataService) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['ECRNumber', 'ECRRelease', 'EcmStatus', 'Version', 'RoutedBy', 'DateTime', 'RejectedUser', 'ReworkComments'] :
        ['ECRNumber', 'ECRRelease', 'EcmStatus', 'Version', 'RoutedBy', 'DateTime', 'RejectedUser', 'ReworkComments'];
    });
  }
  displayedColumns = ['ECRNumber', 'ECRRelease', 'EcmStatus', 'Version', 'RoutedBy', 'DateTime', 'RejectedUser', 'ReworkComments'];
  selectedFiles: string[] = [];
  EcmStatusId: string;
  DepartmentList: any = [];
  ProcessList: any = [];
  ecrImpl: any = {
    "EcrNumber":'',
    "SectionName": "",
    "ModelName": "",
    "ComponentName": "",
    "AreaName": [],
    "UserName": localStorage.getItem("currentUser")
  };
  routing: any = {
    "EcmStatusId": 0,
    "ProcessId": 0,
    "SelectedCheckLists": [],
    "Comments": " ",
    "isApproved": Boolean,
    "UserName": localStorage.getItem('currentUser'),
    "ReturnTo": "",
    "FileName": "",
    "ECRImplemented": true,
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
  dataDepart: any = []
  dataProcess: any = []
  Departstaus: string
  routedList: any = [];
  process: any = [];
  selectedItems: any = []
  processLists: any = {
    "processName": '',
    "checkList": []
  }
  checkList: any[]
  fileDownload: any = {
    "Filename": "string",
    "EcrNumber": "string",
    "Version": 0
  }

  ngOnInit() {
    console.log(this.loginDepartment)
    this.loginDepartment = JSON.parse(localStorage.getItem('Process'));
    this.getRouting();
    this.getProcesslist();
    this.getAreaList();
    this.getSectionList();
    this.getModels();
    this.getComponents();
    var ar = [1,2,3,4,5];

ar.some(function(item,index){
  if(item == 3){
     return true;
  }
  console.log("item is :"+item+" index is : "+index);
});
    
   // this.ecrImpl.SectionName = 
  }
  assign()
  {
    console.log(this.ecr.ECRNumber)
    this.ecrImpl.EcrNumber = this.ecr.ECRNumber;
    
  }
  onFileChangedEcr(event) {
    this.selectedImages = [];
    this.isSpinnerImage = true
    this.selectedImages = event.target.files;
    this.isSpinnerImage = false
    

  }

  onFileChangedCsv(event) {
    this.selectedCsvs = event.target.files;
  }
  

  getRouting() {
    this.user = localStorage.getItem("currentUser");
    this._ecrService.RoutedTask(this.user).subscribe(
      (response) => {
        const result = response;
        console.log(result);
        if (result.code) {
          this.routedList = result.data
          this.dataSource = new MatTableDataSource<any>(this.routedList);
          this.isButton = false
        }
      }
    )
  }
  showUpdateForm(ecr) {

    if (ecr.EChangeRecord.SerialNumber == null) {
      this.ecr.SerialNumber = "Empty"
    }
    this.ecr = { ...ecr.EChangeRecord };
    this.isTable = false;
    this.isEdit = true;
    this.ecr.isDisable = true;
    this.EcmStatusId = ecr.EcmStatusId;
    this.getDeptProcess();
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

  }
  getRoutingTable() {
    this._router.navigate(['routingecns'])
  }
  isSpinnerImage:boolean = false
  getDeptProcess() {

    this._ecrService.getDeptProcess(this.EcmStatusId).subscribe(
      (response) => {
        const result = response
        var BreakException = {};

        if (result.code) {
        //  console.log(result.data)
        this.DepartmentList =[];
          this.dataDepart = result.data['departments']

          this.DepartmentList.push(this.dataDepart)

          this.dataProcess = result.data['processEcm']
          this.dataProcess.forEach(elem => {
            this.ProcessList.push(elem.Process)
          })
          

          try {
            this.dataProcess.forEach((elem, index) => {
        
              this.process.forEach(element => {
                if (elem.Status != "ACC") {
                  if(elem.Process.ProcessName == element.ProcessName)
                  {
                    this.loginDepartment.forEach(elemId => {
                      if(element.Id == elemId)
                      {
                        this.routing.ProcessId = elemId
                        console.log(this.routing.ProcessId)
                      }
                      
                    });
                    this.processLists.processName = element.ProcessName;
                    if(this.processLists.processName=="Weld Engineering" ||
                    this.processLists.processName.includes("Manufacturing"))
                    {
                      this.isEcr = true
                    }
                    else
                    {
                      this.isEcr = false
                    }
                    localStorage.setItem("processLists", this.processLists.processName)
                    this.processLists.checkList = element.CheckLists;
                    if(elem.Status != "ACC")
                    {
                      throw BreakException;
                    }
                  }
                }
              });
  
            });
          } catch (e) {
            if (e !== BreakException) throw e;
          }

          localStorage.setItem("processlist", JSON.stringify(this.ProcessList))
        }
      }
    )
  }
  loginDepartment: any = [];
  getApproveReject() {
    let process = [];
    this.uploadFiles();
    this.dataProcess.forEach(element => {
      if(this.processLists.processName != element.Process.ProcessName 
        && element.Status!="WIP"){
        process.push(element.Process.ProcessName)
      }
    });
    console.log(this.dataProcess)
    this.shared.updateList(process);
    let dialogRef = this.dialog.open(QualityuserComponent, {
      width: '40vw',
      height: '50vh',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(res => {

      if (res) {
        
        this.routing.FileName = this.browseFiles.length==0? "":this.browseFiles[0].name;
        this.routing.comments = res.data
        this.routing.ECRImplemented = this.isAddEcr
        this.routing.EcmStatusId = this.EcmStatusId
        this.routing.ReturnTo = localStorage.getItem("reject")
        this.routing.SelectedCheckLists = this.selectedItems

        this.routing.isApproved = this.isApprove;

        if( this.routing.ReturnTo == "originator")
        {
          let obj={
            "EcmStatusId": this.EcmStatusId,
            "ProcessId": 0,
            "SelectedCheckLists": [
              0
            ],
            "Comments": res.data,
            "isApproved": true,
            "UserName": localStorage.getItem('currentUser'),
            "ReturnTo": localStorage.getItem("reject"),
            "FileName": "",
            "ECRImplemented": true
          }
          this._ecrService.approveOriginator(obj).subscribe(
            (response) => {
              const result = response
              if (result.code) {
                this.toasterService.success('Status Updated', 'Success');
                this.isTable = true
              }
            }
          )

        }
        else{

          this._ecrService.approve(this.routing).subscribe(
            (response) => {
              const result = response
              if (result.code) {
                this.toasterService.success('Status Updated', 'Success');
                this.isTable = true
              }
            }
          )
        }
        }


    })

  }



  getApprove() {

    this.uploadFiles();
    this.routing.FileName = this.browseFiles.length==0? "":this.browseFiles[0].name;
    this.routing.EcmStatusId = this.EcmStatusId
     this.routing.ECRImplemented = this.isAddEcr
    this.routing.SelectedCheckLists = this.selectedItems
    this.routing.ReturnTo = ""

    this.routing.isApproved = this.isApprove;
    this._ecrService.approve(this.routing).subscribe(
      (response) => {
        const result = response
        if (result.code) {
          this.toasterService.success('Status Updated', 'Success');
          this.getRouting();
        }
      }
    )
  }
  selecvalue
  selected_Group(e:HTMLInputElement, model, v) {
    
    this.selectedItems.forEach(element => {
    if(element==model.Id)
    {
      const index = this.selectedItems.indexOf(model.Id, 0);
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        }
    }
    });
    if (e.value == "passed") {
      this.selectedItems.push(model.Id)
    }
    
     
  
  }
  browseFiles = [];

  onFileChanged(event) {
    
    this.browseFiles = event.target.files;

  }

  uploadFiles() {
    // console.log(this.browseFiles);
    if (this.browseFiles.length == 0)
      return;
    for (let i = 0; i < this.browseFiles.length; i++) {
      const uploadData = new FormData();
      uploadData.append('File', this.browseFiles[i]);
      this._ecrService.getClearTemp();
      this._ecrService.UploadFile(uploadData).subscribe((data) => data);
    }
  }


  isEcr=false
  isAddECM = false
  isAddEcr = false
  getProcesslist() {
    this._ecrService.getProcesslist().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.process = result.data
          console.log(this.process);
          this.process.forEach(element => {
            if (element.Id == (this.loginDepartment.slice(0, 1)[0])) {
              this.routing.ProcessId = this.loginDepartment[0]
              this.processLists.processName = element.ProcessName;
              if(this.processLists.processName=="Weld Engineering")
              {
                this.isEcr = true
              }
              localStorage.setItem("processLists", this.processLists.processName)
              this.processLists.checkList = element.CheckLists;
              console.log(this.processLists.checkList)
            }
          });
        }
        //console.log(this.selectedItems);

      }
    ),
      (error) => {
        console.log('getProcesslist()', error)
      }

  }
  isButton:boolean= false
  
  addEcr(f:NgForm)
  {
   
    this._procedureService.clearTemp().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.uploadImageEcr(f)
         
        }

      },
      (error) => {
        console.log('clearTemp', error);
        this.isAddECM = false;
        this.isTable= false
        this.isEdit = true

      }
    );
  }
  isSpinner = false;
  async uploadImageEcr(f) {
    
    this.progressvalue=0
    this.progressMessage = "Uploading " + this.selectedImages.length+1 +" Images....";
    for (let i = 0; i < this.selectedImages.length; i++) {
      this.progressvalue =  (100/this.selectedImages.length) *i
      this.progressMessage = "Uploading " + this.selectedImages.length+1 +" Images...."+ this.progressvalue;
      const uploadData = new FormData();
      uploadData.append('File', this.selectedImages[i]);
      this.isSpinner = true;
      const res = await this._procedureService.imageUpload(uploadData)
      if (res.code) {
        if (i == this.selectedImages.length - 1) {
          const uploadData = new FormData();
          uploadData.append('File', this.selectedCsvs[0]);
          this.progressMessage = "Uploading Procedures....";
          this._procedureService.imageUpload2(uploadData).subscribe(
            (response) => {
              const result = response;
              if (result.code) {
                this._procedureService.addEcr(this.ecrImpl).subscribe(
                  (response) => {
                    const result = response;
                    if (result.code) {
                      Swal.fire({
                        title: 'Info',
                        text: "Sucess",
                        confirmButtonText: 'Ok',
                        cancelButtonText: 'NO',
                        width: 900,
                        padding: '9em',
                        showCancelButton: false,
                        showCloseButton: true
                      })
                      //this.toastr.success(result.message, 'Success');
                     
                      this.getRouting();
                      f.resetForm();
                    }
                    else {
                      this.toastr.error(result.message, 'Error');
                      
                      this.getRouting();
                      f.resetForm();
                    }

                  },
                  (error) => {
                    this.isSpinner = false;
                    console.log('addProcedure()', error)
                  }
                );
                this.isAddEcr =true
                this.isAddECM = false;
                this.isButton = true;
                this.isTable= false
                this.isEdit = true
              } else {
                this.isSpinner = false;
                Swal.fire({
                  title: 'Info',
                  text: result.message,
                  type: 'warning',
                  confirmButtonText: 'Download error log',
                  showCancelButton: true,
                  showCloseButton: true
                }).then((res) => {
                  if (res) {
                    this.exportAsXLSX(result.data)
                  } else {
                    this.toastr.error(result.message, 'Error')
                  }
                })
                this.isAddEcr =true
                this.isAddECM = false;
                this.isButton = true;
                this.isTable= false
                this.isEdit = true
              }
            },
            (error) => {
              this.isSpinner = false;
              console.log('csv upload failed', error)
            }
          );
        }
      } else {
        this.isSpinner = false;
        this.toastr.error('Error', res.message)
        this.isAddEcr =true
        this.isAddECM = false;
        this.isButton = true;
        this.isTable= false
        this.isEdit = true
      }
    }
    this.progressMessage = "";
    this.progressvalue = 0;
  }
  exportAsXLSX(excelList): void {
    this._excelService.exportAsExcelFile(excelList, 'Excel');
  }

  sectionName:any;
  modelList:any=[]
  currentUser=localStorage.getItem("currentUser")
  SectionList:any=[]
  getSectionList() {
    this._procedureService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
         
          
        } else {
          this.SectionList = [];
        }
      },
      (error) => {
        console.log(error, ' getSectionList()');

      }
    );
  }
  getModels() {
  
    this._procedureService.getModelList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.modelList = result['data']
        } else {
          this.modelList = []
        }
      },
      (error) => {
        console.log(error, 'getModels()');
      }
    );
  }
  componentList:any=[]
  getComponents() {
    this._procedureService.getComponentList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.componentList = result['data']
        } else {
          this.componentList = []
        }
      },
      (error) => {
        console.log(error, 'getComponents()');
      }
    );
  }
  areaList:any=[]
  getAreaList() {
    this._procedureService.getAreaList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.areaList = result.data;
  
        } else {
          this.areaList = [];
        }
      },
      (error) => {
        console.log(error, 'getAreaList()');

      }
    );
  }

  
  download(model)
  {
    console.log(model)
    let obj={
      
        "Filename": model.Files,
        "EcmStatusId":model.EcmStatusId,
        "ProcessId": model.ProcessId
      
    }

    this._ecrService.getDownloadProcessFile(obj).subscribe((data)=>
      {
        let blob = new Blob();
        blob = new Blob([data]);
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = model;
        link.click();
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
  EcmStatus: string,
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
