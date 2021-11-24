import { Component, OnInit, ViewChild } from '@angular/core';
import { TraceabilityService } from '../../../providers/traceability.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatOption } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ExcelService } from '../../../providers/excel.service';
import { ImageComponent } from './image.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-traceability',
  templateUrl: './traceability.component.html',
  styleUrls: ['./traceability.component.css']
})
export class TraceabilityComponent implements OnInit {
  displayedColumns = ['SequenceNumber', 'Description', 'AreaName', 'Operator', 'WeldProcedure', 'PvaFolder', 
  'Approval','Id','LoginId','QualityInstructionsId','StatusId',
  'WeldProcess', 'WireDiameter', 'WeldPosition', 'WeldSize', 'WeldType', 'WireFeedSpeed', 'Voltage', 'FigureVisual',
   'WeldVolume', 'LineLoadNumber', 'SectionName', 'ModelName', 'ComponentName','EffectiveDate' ,'EngineeringChange',
   'UserName', 'SerialNumber', 'PartNumber','PartNumber_EngineeringChange','HeatCodeInfo','FoundryMarking',
   'PartSerialNumber','Time', 'CompletedTime', 'StartTime', 'EndTime','Notes']
  dataSource = new MatTableDataSource<traceabilityData>();
  selection = new SelectionModel<traceabilityData>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  traceabilityList: any = [];
  isTable: any = true;
  chartData: any = [];
  view: any[] = [1550, 650];
  component:any;
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'WI-Sequence Number';
  yAxisLabel: string = 'Time (Min)';
  timeline: boolean = true;
  lineLoadNumbers: any = [];
  selectedLineLoadNumber: any;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  AreaList: any = [];
  ModelList: any = [];
  SectionList: any = [];
  ComponentList: any = [];
  traceabilityObj: any = {
    "LineLoadNumber":[],
    "AreaName":[],
    "ComponentName": [],
    "CATModelName": [],
    "SectionName": []

  };
  constructor(private _traceabilityService: TraceabilityService,
    private _excelService: ExcelService,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getSectionList();
  }

  getSectionList() {
    this._traceabilityService.getSectionList().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.SectionList = result.data;
          this.traceabilityObj.SectionName = this.SectionList[0];
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

    let obj =
    {
      'areas':this.traceabilityObj.SectionName
    }
    this._traceabilityService.getAreaList(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.AreaList = result.data;
          this.traceabilityObj.AreaName = this.AreaList[0];
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
  
  allSelected=false;

  toggleAllSelection(select) {
    if (this.allSelected) {
      select.options.forEach((item: MatOption) => item.select());
    } else {
      select.options.forEach((item: MatOption) => item.deselect());
    }
    this.allSelected = false
  }
  
  getComponentList() {
    let obj =
    {
      'components':this.traceabilityObj.AreaName,
      'models':this.traceabilityObj.ModelName
    }
    
    this._traceabilityService.getComponentList(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ComponentList = result.data;
          this.traceabilityObj.ComponentName = this.ComponentList[0];
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
    let obj =
    {
      'componentsToModel':this.traceabilityObj.ComponentName
    }
    this._traceabilityService.getModelList(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.ModelList = result.data;
          this.traceabilityObj.CATModelName = this.ModelList[0];
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
        "SectionName" : this.traceabilityObj.SectionName,
        "AreaName" : this.traceabilityObj.AreaName,
        "ComponentName" : this.traceabilityObj.ComponentName,
        "ModelName" :[this.traceabilityObj.CATModelName ]  
    }
    this._traceabilityService.getLineLoadNumbers(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.lineLoadNumbers = result.data;
          this.traceabilityObj.LineLoadNumber = this.lineLoadNumbers[0];
         
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
  isSpinner:boolean=false
  gettracability() {

    this.spinnerService.show()

    let obj =
    {
      "LineLoadNumber" :  this.traceabilityObj.LineLoadNumber,
      "AreaName" :  this.traceabilityObj.AreaName,
      "CATModelName" :  this.traceabilityObj.CATModelName,
      "ComponentName" : this.traceabilityObj.ComponentName,
      "SectionName" :  this.traceabilityObj.SectionName,
    }
    this._traceabilityService.getTraceability(obj).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          
          this.component = result.data['Component'];
          this.traceabilityList = result.data['TraceValues'];
          this.chartData = result.data['TraceGraph']
          this.dataSource = new MatTableDataSource<any>(this.traceabilityList)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide();
        }
        else {
          this.traceabilityList = [];
          this.spinnerService.hide();
        }
      },
      (error) => {
        console.log('gettracability()', error)
        this.spinnerService.hide();
      });

      
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  Approval=[]
  Id=[]
  LoginId = []
  QualityInstructionsId=[]
  StatusId = []
  exportAsXLSX(): void {
    let excelList =[];
    this.traceabilityList.forEach(element => {
      element.QualityAudit.forEach(elem => {
        this.Approval.push(elem.Approval)
        this.Id.push(elem.Id)
        this.LoginId.push(elem.Id)
        this.QualityInstructionsId.push(elem.QualityInstructionsId)
        this.StatusId.push(elem.StatusId)
      });
      localStorage.setItem("Approval",this.Approval.toString())
      localStorage.setItem("Id",this.Id.toString())
      localStorage.setItem("LoginId",this.LoginId.toString())
      localStorage.setItem("StatusId",this.StatusId.toString())
      localStorage.setItem("QualityInstructionsId",this.QualityInstructionsId.toString())
      
      let obj ={
        'SequenceNumber': element.procedure?element.procedure.SequenceNumber:'',
        'Description': element.procedure?element.procedure.Description:'',
        'AreaName': element.AreaNames?element.AreaNames.AreaName:'',
        'Operator': element.procedure?element.procedure.Operator:'',
        'WeldProcedure':element.procedure?element.procedure.WeldProcedure:'', 
        'PvaFolder':element.procedure?element.procedure.PvaFolder:'', 
        'Quality Approval':localStorage.getItem("Approval"),
        'Quality Id':localStorage.getItem("Id"),
        'Quality LoginId':localStorage.getItem("LoginId"),
        'QualityInstructionsId':localStorage.getItem("QualityInstructionsId"),
        'Quality StatusId':localStorage.getItem("StatusId"),
        'WeldProcess':element.procedure?element.procedure.WeldProcess:'',
        'WireDiameter':element.procedure?element.procedure.WireDiameter:'', 
        'WeldPosition':element.procedure?element.procedure.WeldPosition:'',
        'WeldSize':element.procedure?element.procedure.WeldSize:'',
        'WeldType':element.procedure?element.procedure.WeldType:'',
        'WireFeedSped':element.procedure?element.procedure.WireFeedSped:'', 
        'Voltage':element.procedure?element.procedure.Voltage:'', 
        'FigureVisual':element.procedure?element.procedure.FigureVisual:'',
        'WeldVolume':element.procedure?element.procedure.WeldVolume:'',
        'LineLoadNumber': element.LineLoadNumbers?element.LineLoadNumbers.LineLoadNumber:'', 
        'SectionName':element.LineLoadNumbers?element.LineLoadNumbers.SectionName:'',
        'ModelName':element.LineLoadNumbers?element.LineLoadNumbers.ModelName:'',
        'ComponentName':element.LineLoadNumbers?element.LineLoadNumbers.ComponentName:'',
        'EngineeringChange':element.procedure?element.procedure.EChangeRecordId:'',
        'EffectiveDate': element.LineLoadNumbers?element.LineLoadNumbers.CreatedTimeStamp:'', 
        'UserName':element.LineLoadNumbers?element.LineLoadNumbers.UserName:'',
        'PartNumber':element.PartNumber?element.PartNumber.PartNumberName:'',
        'PartNumber_EngineeringChange':element.PartNumber?element.PartNumber.EngineeringChange:'',
        'HeatCodeInfo':element.PartNumber?element.PartNumber.HeatCodeInfo :'',
        'PartNumber_FoundryMarking':element.PartNumber?element.PartNumber.FoundryMarking :'',
        'PartNumber_SerialNumber':element.PartNumber?element.PartNumber.SerialNumber :'',
        'SerialNumber': element.LineLoadNumbers?element.LineLoadNumbers.SerialNumber:'',
        'Time': element.procedure?element.procedure.Time:'',
        'CompletedTime':element.CompletedTime?element.CompletedTime:'',
        'StartTime':element.checkedOut?element.checkedOut.StartTime:'',
        'EndTime':element.Completed?element.Completed.StartTime:'', 
        'Notes':element.UserTexts 
      }
      excelList.push(obj)
      this.Approval=[]
      this.Id=[]
      this.LoginId = []
      this.QualityInstructionsId=[]
      this.StatusId = []
    })
    this._excelService.exportAsExcelFile(excelList, 'Traceability');
  }

  openImageModal(element){
    const dialogRef = this.dialog.open(ImageComponent, {
      data: element.ImageUrl
    });

  }

}

export interface traceabilityData {
  SequenceNumber:string ;
  Description:string ;
  AreaName:string ;
  Operator:string ;
  WeldProcedure:string; 
  PvaFolder:string; 
  WeldProcess:string;
  WireDiameter:string; 
  WeldPosition:string;
  WeldSize:string;
  WeldType:string;
  WireFeedSpeed:string; 
  Voltage:string
  FigureVisual:string;
  WeldVolume:string;
  LineLoadNumber:string 
  SectionName:string;
  ModelName:string;
  ComponentName:string;
  UserName:string;
  SerialNumber:string ;
  PartNumber:string
  Time:string ;
  CompletedTime:string;
  StartTime:string;
  EndTime:string
}
