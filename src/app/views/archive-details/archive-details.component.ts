import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ArchiveService } from '../../../providers/archive.service';
import { DataService } from '../../../providers/share-data.service';
import { ExcelService } from '../../../providers/excel.service';
import { ImageComponent } from '../traceability/image.component';

@Component({
  selector: 'app-archive-details',
  templateUrl: './archive-details.component.html',
  styleUrls: ['./archive-details.component.css']
})
export class ArchiveDetailsComponent implements OnInit {
  currentUser: any;
  displayedColumns = ['SequenceNumber', 'Description', 'AreaName', 'Operator', 'WeldProcedure', 'PvaFolder', 'WeldProcess', 'WireDiameter', 'WeldPosition', 'WeldSize', 'WeldType', 'WireFeedSpeed', 'Voltage', 'FigureVisual', 'WeldVolume', 'LineLoadNumber', 'SectionName', 'ModelName', 'ComponentName', 'UserName', 'SerialNumber', 'PartNumber', 'Time', 'CompletedTime', 'StartTime', 'EndTime']  
  dataSource = new MatTableDataSource<traceabilityData>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  traceabilityList:any =[];
  chartData: any = [];
  view: any[] = [1550, 650];
  isTable:boolean = true;
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
  selectedLineLoadNumber: any;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  constructor(
    private _archiveService: ArchiveService,
    private _dataService:DataService,
    private _excelService: ExcelService,
    public dialog: MatDialog
    ) {
    this.currentUser = localStorage.getItem('currentUser');
    this._dataService.currentMessage.subscribe( obj => {
      this.archiveUnitDataDetails(obj)
    } 
    );
  }
  ngOnInit() {
  }

  archiveUnitDataDetails(element) {
    this._archiveService.archiveUnitDataDetails(element).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.traceabilityList = result.data['TraceValues'];
          this.chartData = result.data['TraceGraph']
          this.dataSource = new MatTableDataSource<traceabilityData>(this.traceabilityList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.traceabilityList = [];
        }
      },
      (error) => {
        console.log(error, 'archiveUnitDataDetails()');
      }
    );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportAsXLSX(): void {
    let excelList =[];
    this.traceabilityList.forEach(element => {
      let obj ={
        'SequenceNumber': element.procedure?element.procedure.SequenceNumber:'',
        'Description': element.procedure?element.procedure.Description:'',
        'AreaName': element.AreaNames?element.AreaNames.AreaName:'',
        'Operator': element.procedure?element.procedure.Operator:'',
        'WeldProcedure':element.procedure?element.procedure.WeldProcedure:'', 
        'PvaFolder':element.procedure?element.procedure.PvaFolder:'', 
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
        'UserName':element.LineLoadNumbers?element.LineLoadNumbers.UserName:'',
        'PartNumber':element.PartNumber?element.PartNumber.PartNumberName:'',
        'SerialNumber': element.LineLoadNumbers?element.LineLoadNumbers.SerialNumber:'',
        'Time': element.procedure?element.procedure.Time:'',
        'CompletedTime':element.CompletedTime?element.CompletedTime:'',
        'StartTime':element.checkedOut?element.checkedOut.StartTime:'',
        'EndTime':element.Completed?element.Completed.StartTime:'', 
      }
      excelList.push(obj)
    })
    this._excelService.exportAsExcelFile(excelList, 'Excel');
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
  Time:string ;
  CompletedTime:string;
  StartTime:string;
  EndTime:string
}
