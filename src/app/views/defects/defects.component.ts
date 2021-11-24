import { Component, OnInit, ViewChild } from '@angular/core';
import { AnnotationService } from '../../../providers/annotation.service';
import { MatTableDataSource, MatPaginator, MatSort, MatOption } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TraceabilityService } from '../../../providers/traceability.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AllService } from '../../../providers/all.service';

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.css']
})
export class DefectsComponent implements OnInit {
  defectsList:any=[]
  dataSource:any = []
  SerialNumber=''
  SectionName =''
  ModelName=''
  LineLoadNumber=''
  ComponentName=''
  AreaName=''
  lineLoadNumbers: any = [];
  AreaList: any = [];
  ModelList: any = [];
  SectionList: any = [];
  ComponentList: any = [];
  isTable = true;
  isEdit = false;
  defect:any={
    "Id": 0,
    "CorrectiveActionStatus": "",
    "ProblemCorrection": "",
    "InterimContainmentAction": "",
    "RootCause": "",
    "PermanentCorrectiveAction": "",
    "AccountableOperator": "",
    "AccountableOperatorComment": "",
    "Assignto": "",
    "LastChanged": "2020-07-22T07:28:15.334Z",
    "SignOff": true,
    "InspectionType":""
  }
  defectobj: any = {
    "LineLoadNumber":'',
    "AreaName":[],
    "ComponentName": [],
    "CATModelName": [],
    "SectionName": [],
    "InspectionType":'',
    "Aprrove":Boolean,
    "SignOff":Boolean,
  };
  BooleanList = [true,false]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _service : AnnotationService,private _allService:AllService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,private _traceService : TraceabilityService) { }
  displayedColumns = ['EventNumber','CheckPoint','InspectionType','PersonExecuted','AuditPerson','Area','Component','LineLoadNumber',
  'Model','Section','SerialNumber',
  'AccountableOperator','AccountableOperatorComment','Approval','AuditNumber','CorrectiveActionStatus','InterimContainmentAction','PermanentCorrectiveAction'
,'ProblemCorrection','QualityComments','RootCause','SignOff']
  ngOnInit() {
    this.getSectionList();
  }
  allSelected=false;

  toggleAllSelection(select) {
    if (this.allSelected) {
      select.options.forEach((item: MatOption) => item.select());
    } else {
      select.options.forEach((item: MatOption) => item.deselect());
    }
    this.allSelected = false
  }

  getDefects() {
    this.spinnerService.show()
    this._service.getFilterDefects(this.defectobj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.defectsList = result.data
          this.dataSource = new MatTableDataSource<any>(this.defectsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide()
        }
        else {
          this.defectsList = [];
          this.spinnerService.hide()
        }
      },
      (error) => {
        console.log('getDefects()', error)
      });
      this.spinnerService.hide()

  }

  // getDefects()
  // {
  //   this._service.getDefects().subscribe(
  //     (response)=>
  //     {
  //       const result =response
  //       if(result.code)
  //       {
  //         this.defectsList = result.data
  //         this.dataSource = new MatTableDataSource<any>(this.defectsList);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //     }
  //   )
  // }
  getSectionList() {
    this._traceService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
          this.defectobj.SectionName = this.SectionList[0];
          this.getAreaList();
        } else {
          this.SectionList = [];
        }
      },
      (error) => {
        console.log(error, 'getSectionList()');

      }
    );
  }

  getAreaList() {
    let obj = {
      "areas":this.defectobj.SectionName
    }
    this._allService.getAreaList(this.defectobj.SectionName).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.AreaList = result.data;
          this.defectobj.AreaName = this.AreaList[0];
          this.getComponentList();
        } else {
          this.AreaList = [];
        }
      },
      (error) => {
        console.log(error, 'getAreaList()');

      }
    );
  }
  
  getComponentList() {
    
    this._allService.getComponentList(this.defectobj.AreaName).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ComponentList = result.data;
          this.defectobj.ComponentName = this.ComponentList[0];
          this.getModelList();
        } else {
          this.ComponentList = [];
        }
      },
      (error) => {
        console.log(error, 'getComponentList()');
      }
    );
  }

  getModelList() {
    this._allService.getModelList(this.defectobj.ComponentName).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ModelList = result.data;
          this.defectobj.CATModelName = this.ModelList[0];
          this.getLineLoadNumbers();
        } else {
          this.ModelList = [];
        }
      },
      (error) => {
        console.log(error, ' getModelList()');
      }
    );
  }

  getLineLoadNumbers() {
    const obj ={
        "SectionName" : this.defectobj.SectionName,
        "AreaName" : this.defectobj.AreaName,
        "ComponentName" : this.defectobj.ComponentName,
        "ModelName" :this.defectobj.CATModelName   
    }
    this._traceService.getLineLoadNumbers(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.lineLoadNumbers = result.data;
          this.defectobj.LineLoadNumber = this.lineLoadNumbers[0];
        
        }
        else {
          this.lineLoadNumbers = []
        }
      },
      (error) => {
        console.log('getLineLoadNumbers()', error);
      }
    );
  }
  showUpdateForm(defects) {
    this.defect = { ...defects };
    if(defects.unit != null)
    {
      this.AreaName = defects.unit.AreaName
      this.ComponentName = defects.unit.ComponentName
      this.LineLoadNumber = defects.unit.LineLoadNumber
      this.ModelName = defects.unit.ModelName
      this.SectionName = defects.unit.SectionName
      this.SerialNumber = defects.unit.SerialNumber
    }

    
    // this.defects.Id = 0,
    // this.defects.IdCorrectiveActionStatus= defect.CorrectiveActionStatus,
    // this.defects.IdProblemCorrection= defect.ProblemCorrection,
    // this.defects.IdInterimContainmentAction= defect.InterimContainmentAction
    // this.defects.IdRootCause= defect.RootCause
    // this.defects.IdPermanentCorrectiveAction= defect.PermanentCorrectiveAction
    // this.defects.IdAccountableOperator= defect.AccountableOperator,
    // this.defects.IdAccountableOperatorComment= defect.AccountableOperatorComment
    // this.defects.IdAssignto= ''
    // this.defects.IdLastChanged= ''
    // this.defects.IdSignOff= defect.SignOff
    
    this.isTable = false
    this.isEdit = true;
  }

  showTable() {
    this.isEdit = false;
    this.isTable = true;
  }
  updateDefects(f:NgForm) {
    let AuditId:Number;
    if(this.defect.InspectionType=="QA")
    {
      AuditId = this.defect.Id
    }
    else if(this.defect.InspectionType=="NDE")
    {
      AuditId = this.defect.Id
    }
    else if(this.defect.InspectionType=="RI")
    {
      AuditId = this.defect.Id
    }
    let obj ={
      "Id": AuditId,
      "CorrectiveActionStatus": this.defect.CorrectiveActionStatus,
      "ProblemCorrection": this.defect.ProblemCorrection,
      "InterimContainmentAction": this.defect.InterimContainmentAction,
      "RootCause":  this.defect.RootCause,
      "PermanentCorrectiveAction":  this.defect.PermanentCorrectiveAction,
      "AccountableOperator":  this.defect.AccountableOperator,
      "AccountableOperatorComment":  this.defect.AccountableOperatorComment,
      "Assignto":  this.defect.Assignto,
      "LastChanged": Date,
      "SignOff":  this.defect.SignOff,
      "InspectionType": this.defect.InspectionType
    }
    this._service.addDefects(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getDefects();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getDefects();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'updatePlant()');

      }
    );
  }

  
}
