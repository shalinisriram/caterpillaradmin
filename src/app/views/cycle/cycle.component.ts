import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AnnotationService } from '../../../providers/annotation.service';
import { ToastrService } from 'ngx-toastr';
import { ProcedureService } from '../../../providers/procedure.service';
import { AreaService } from '../../../providers/area.service';
import { CatmodelService } from '../../../providers/catmodel.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { SectionService } from '../../../providers/section.service';
import { ComponentService } from '../../../providers/component.service';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.css']
})
export class CycleComponent implements OnInit {
  isTable=true
  isAdd=false
  isEdit=false
  displayedColumns = ['Id','AreaId', 'IsActive','ModelId','SectionId','ComponentId','Value','Select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selectedItemIds: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private _cyleTime: AnnotationService,private toastr: ToastrService,
    private _procedureService:ProcedureService, private _areaService: AreaService,
    private _ComponentService: ComponentService,
    private _sectionService: SectionService,
    private _modelService: CatmodelService,) { }

  ngOnInit() {
    this.getCycle();
    this.getAreaList();
    this.getModelList();
    this.getComponentList();
    this.getSectionList();
  }
  CycleList:any=[]
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  getCycle()
  {
    this._cyleTime.getCycle().subscribe(
      (response)=>{
        const result = response
        if(result.code)
        {
          this.CycleList = result.data
          this.dataSource = new MatTableDataSource<any>(this.CycleList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else{
          this.CycleList=[]
        }
      }
    );
    (error)=>{
      console.log("getCycle()")
    }
  }
  
  cycle:any={
    "Id": 0,
    "AreaId": 0,
    "ModelId": 0,
    "SectionId":0,
    "ComponentId":0,
    "Value": 0,
    "IsActive": true,
    "CurrentTimeStamp": "2020-10-12T14:49:06.313Z",
    "Ids": [
      0
    ]
  }

  update:any={
    "Id":0,
    "AreaName":"",
    "ModelName":'',
    "SectionName":'',
    "ComponentName":'',
    "Value":0
  }
  AreaList:any=[]
  getAreaList() {
    this._areaService.getAreas().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.AreaList = result.data;
         
     
        } else {
          this.AreaList = [];
          
        }
      },
      (error) => {
        console.log(error, 'getAreaList()');

      }
    );
  }
  ModelList:any=[]
  getModelList() {
    this._modelService.getModels().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ModelList = result.data;
         
        } else {
          this.ModelList = [];
         
        }
      },
      (error) => {
        console.log(error, ' getModelList()');
      }
    );
  }
  ComponentList :any =[]
  getComponentList() {
    this._ComponentService.getcomponent().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ComponentList = result.data;
         
        } else {
          this.ComponentList = [];
         
        }
      },
      (error) => {
        console.log(error, ' getComponentList()');
      }
    );
  }
  SectionList:any=[]
  getSectionList() {
    this._sectionService.getSections().subscribe(
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
  addycle(f:NgForm) {
    this.cycle.AreaId = Number( this.cycle.AreaId)
    this._cyleTime.addCycle(this.cycle).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isAdd = false;
          this.isTable = true;
          this.getCycle();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isAdd = false;
          this.isTable = true;
          this.getCycle();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'addCycle()');
      }
    );
  }

  showUpdateForm(plant) {
    // this.cycle = { ...plant };
    console.log(plant)
   
    this.update.AreaName = plant.AreaName
    this.update.ModelName = plant.ModelName
    this.update.Value = plant.Value
    this.update.Id = plant.Id
    this.isTable = false
    this.isEdit = true;
  }

  updateCycle(f:NgForm) {
    this.cycle.Id = this.update.Id
    this.AreaList.forEach(element => {
      if(element.AreaName== this.update.AreaName)
      {
        this.cycle.AreaId = element.Id
      }
    });
    this.ModelList.forEach(element => {
      if(element.ModelName==this.update.ModelName)
      {
        this.cycle.ModelId = element.Id
      }
    });
    this.cycle.Value=this.update.Value
    this.cycle.AreaId = Number( this.cycle.AreaId)
    this._cyleTime.updateCycle(this.cycle).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.toastr.success(result.message, 'Success');
          this.isEdit = false;
          this.isTable = true;
          this.getCycle();
          f.resetForm();
        } else {
          this.toastr.error(result.message, 'Error');
          this.isEdit = false;
          this.isTable = true;
          this.getCycle();
          f.resetForm();
        }
      },
      (error) => {
        console.log(error, 'updateCycle()');

      }
    );
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



  deleteCycle() {
    this.selectedItemIds = []
    this.selection.selected.forEach(ele => {
      this.selectedItemIds.push(ele.Id)
    });
    Swal.fire({
      title: 'Info',
      text: 'Do you want to delete the selected Cycle?',
      type: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.value) {
        const obj = {
          'Ids': this.selectedItemIds
        }
        this._cyleTime.deleteCycle(obj).subscribe(
          (response) => {
            const result = response;
            if (result.code) {
              Swal.fire(
                'Deleted!',
                'CycleTime have been deleted!',
                'success'
            );
             this.getCycle();
            } else {
              this.toastr.error(result.message ,'Error');
              this.getCycle();
            }
          },
          (error) => {
            console.log(error, 'deleteCycle()');
          }
        );;
      }
    });
  }
}