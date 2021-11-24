import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnnotationService } from '../../../providers/annotation.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatOption } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { AreaService } from '../../../providers/area.service';
import { ProcedureService } from '../../../providers/procedure.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AllService } from '../../../providers/all.service';

@Component({
  selector: 'app-auditsequence',
  templateUrl: './auditsequence.component.html',
  styleUrls: ['./auditsequence.component.css']
})
export class AuditsequenceComponent implements OnInit {
  auditsequence:any=[]
  
  isTable = true
  isAdd = false
  isEdit = false
  auditSequenceList:any={
  "AuditId": 0,
  "AreaName": "",
  "ComponentName":"",
  "SectionName":"",
  "ModelName": "",
  "InspectionType": "",
  "SequenceNo": "",
  "SerialPrefix": "",
}
types:any
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
displayedColumns = ['AreaName','SectionName','ModelName','ComponentName','InspectionType','SequenceNumber','SerialPrefix','Select']
  constructor(private _adminservice: AnnotationService,
    private fb: FormBuilder,
    private _areaService: AreaService,
    private _allService:AllService,
    private _procedure:ProcedureService,
    private _procedureService :ProcedureService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getSectionList()
    
    this.getAreas()
    this.getModel()
  }
  modelList: any = [];
  AuditObj:any={
   
    "AreaName":[],
    "ComponentName": [],
    "CATModelName": [],
    "SectionName": []

  }




  deletePlants() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    console.log(this.selectedItemIds)
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Audit?',
      type: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.value) {
        let obj={
          'Ids':this.selectedItemIds
        }
        
        this._adminservice.deleteAuditsequence(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'Audit have been deleted!',
                'success'
            );
             this.getAuidsequence();
            } else {
              this.toastr.error(result.message ,'Error');
              this.getAuidsequence();
            }
          },
          (error) => {
            console.log(error, 'deleteAudit()');
          }
        );;
      }
    });
  }
  SectionList:any=[]

  allSelected=false
  toggleAllSelection(select) {
    if (this.allSelected) {
      select.options.forEach((item: MatOption) => item.select());
    } else {
      select.options.forEach((item: MatOption) => item.deselect());
    }
    this.allSelected = false
  }

  getSectionList() {
    this._procedureService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
          this.getAreas();          
        } else {
          this.SectionList = [];
          this.getAreas();
        
        }
      },
      (error) => {
        console.log(error, ' getSectionList()');

      }
    );
  }
  componentList:any =[]
  getComponents() {
    let obj
    if(this.isAdd)
    {
      obj = {
        'Model': this.auditSequenceList.ModelName,
        'Area': [this.auditSequenceList.AreaName],
        'UserName': localStorage.getItem('currentUser')
      }
   
    }
   else{

   obj = {
      'Model': this.AuditObj.CATModelName,
      'Area': [this.AuditObj.AreaName],
      'UserName': localStorage.getItem('currentUser')
    }
 
   }
     
    
    this._procedureService.getComponents(obj).subscribe(
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
  addAudit(f: NgForm)
  {
    this.spinnerService.show()
    this._adminservice.addAuditsequence(this.auditSequenceList).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.spinnerService.hide()
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
         
          this.spinnerService.hide()
          f.resetForm();
        } else {
          this.spinnerService.hide()
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
         
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'addAuditSequence()');
        this.spinnerService.hide()
      }
    );
    
    
  }

  getAuidsequence()
 {
   
  this.spinnerService.show()
  this._procedureService.getFilterAuditSequence(this.AuditObj).subscribe(
    (response)=>
    {
      const result = response
      if(result.code)
      {
        this.auditsequence = result.data
        this.dataSource = new MatTableDataSource<any>(this.auditsequence);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinnerService.hide()
      }
      else{
        this.auditsequence=[]
        this.spinnerService.hide()
      }
    }
  );
  (error)=>
  {
    console.log("getAuditSequence",error)
  }
  this.spinnerService.hide()
 }

 showUpdateForm(audit)
 {
   console.log(audit)
   this.auditSequenceList = {...audit}
   this.auditSequenceList.SectionName = audit.Section.SectionName
   this.getModel();
   this.auditSequenceList.ModelName = audit.Model.ModelName

   this.auditSequenceList.AreaName = audit.Area.AreaName
   this.getComponents()
   this.auditSequenceList.ComponentName = audit.Component.ComponentName
   this.auditSequenceList.SerialPrefix = audit.SerialPrefix
   this.auditSequenceList.SequenceNo = audit.SequenceNumber
   this.auditSequenceList.AuditId = audit.Id
   this.isTable = false
   this.isEdit = true
 }
 areaList:any =[];
 getAreas() {
  let obj = {
    'SectionName':''
  }
  if(this.isAdd || this.isEdit)
  {
    obj.SectionName = this.auditSequenceList.SectionName
  }
  else{
    obj.SectionName =this.AuditObj.SectionName
  }
  this._procedure.getAllAreaWithSection(obj.SectionName).subscribe(
    (response) => {
      const result = response;
      if (result.code) {
        console.log(result.data)
         this.areaList = result.data;
         this.getModel()
      } else {
        this.areaList = [];
      }
    },
    (error) => {
      console.log(error, 'getAreas()');
    }
  );
}

getModel()
{

let sec
  if(this.isAdd)
  {
   sec =this.auditSequenceList.SectionName
  }
  else
  {
    sec =this.AuditObj.SectionName
  }
  this._procedure.getModels(sec,localStorage.getItem('currentUser')).subscribe(
    (response)=>
    {
      const result = response
      if(result.code)
      {
        
        this.modelList = result.data
        this.getComponents() 
      }
      else{
        this.modelList=[]
      }
    }
  );
  (error)=>
  {
    console.log("getAuditSequence",error)
  }
}

getAuditName()
{
  let obj={
    'SectionName':this.auditSequenceList.SectionName,
    'ModelName':this.auditSequenceList.ModelName,
    'AreaName':this.auditSequenceList.AreaName,
    'ComponentName':this.auditSequenceList.ComponentName,
  }
  this._procedure.getAudiName(obj).subscribe(
    (response)=>
    {
      const result = response
      if(result.code)
      {
        
        this.types = result.data
      }
      else
      {
        this.types=[]
      }
    }
  )
}
AreaList:any
getAreaList() {
  let obj = {
    "areas":this.AuditObj.SectionName
  }
  this._allService.getAreaList(this.AuditObj.SectionName).subscribe(
    (response) => {
      const result = response;
      if (result.code) {
        this.AreaList = result.data;
        this.AuditObj.AreaName = this.AreaList[0];
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
ComponentList:any
getComponentList() {
    
  this._allService.getComponentList(this.AuditObj.AreaName).subscribe(
    (response) => {
      const result = response;
      if (result.code) {
        this.ComponentList = result.data;
        this.AuditObj.ComponentName = this.ComponentList[0];
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

ModelList:any
getModelList() {
  this._allService.getModelList(this.AuditObj.ComponentName).subscribe(
    (response) => {
      const result = response;
      if (result.code) {
        this.ModelList = result.data;
        this.AuditObj.CATModelName = this.ModelList[0];
        
      } else {
        this.ModelList = [];
      }
    },
    (error) => {
      console.log(error, ' getModelList()');
    }
  );
}

 updateAudit(f:NgForm)
 {
    let obj={
      "AuditId":this.auditSequenceList.AuditId,
      "AreaName": this.auditSequenceList.AreaName,
      "ModelName": this.auditSequenceList.ModelName,
      "InspectionType": this.auditSequenceList.InspectionType,
      "SequenceNo": this.auditSequenceList.SequenceNo,
      "SerialPrefix": this.auditSequenceList.SerialPrefix,

    }
   this._adminservice.updateAuditSequence(obj).subscribe(
     (response)=>
     {
       const result = response
       if(result.code)
       {
        this.toastr.success(result.message,"Success")
        this.isEdit = false;
          this.isTable = true;
          this.getAuidsequence();
          f.resetForm();
       }
       else
       {
        this.toastr.error(result.message,"Error")
        this.isEdit = false;
          this.isTable = true;
          this.getAuidsequence();
          f.resetForm();
       }
     }
   );
   (error)=>
   {
     console.log("updateAuditsequence()",error)
   }
 }
 isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
}

checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

}
