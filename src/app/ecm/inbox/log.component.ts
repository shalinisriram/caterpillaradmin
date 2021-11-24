import { Component, Inject } from "@angular/core";
import { MatDialogRef, MatTableDataSource } from "@angular/material";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EcrcreationService } from "../../../providers/ecrcreation.service";


@Component({
  selector: 'UserTextModal',
  template:
    `<h1 mat-dialog-title class="text-center" style="font-size:40px;font-weight: bold;">Log</h1>
    <div mat-dialog-content>
    <div class="mat-elevation-z8">
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="EcrNumber">
        <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
        EcrNumber
        </th>
        <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center"> 
          {{row.EcrNumber.ECRNumber}}<br>
        </td>
      </ng-container>
    <ng-container matColumnDef="ECRRelease">
    <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
    ECRRelease
    </th>
    <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
    {{row.EcrNumber.ECRRelease}}<br>
    </td>
  </ng-container>
  <ng-container matColumnDef="ECRType">
    <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
    ECRType
    </th>
    <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
      {{row.EcrNumber.ECRType}}<br>
      </td>
  </ng-container>

  <ng-container matColumnDef="PartNumber">
  <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
  PartNumber
  </th>
  <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
    {{row.EcrNumber.PartNumber}}<br>
    </td>
</ng-container>
<ng-container matColumnDef="RequestedBy">
  <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
  RequestedBy
  </th>
  <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
   {{row.EcrNumber.RequestedBy}}<br>
    </td>
</ng-container>
<ng-container matColumnDef="RevisionNumber">
  <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
  RevisionNumber
  </th>
  <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
   {{row.EcrNumber.RevisionNumber}}<br>
 </td>
</ng-container>
<ng-container matColumnDef="SerialNumber">
  <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
  SerialNumber
  </th>
  <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
  {{row.EcrNumber.SerialNumber}}
  </td>
</ng-container>

<ng-container matColumnDef="InformedToProcess">
  <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
  Informed To Process
  </th>
  <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
    <div *ngFor = "let process of processList">
    {{process.ProcessName}}
    </div>
  </td>
</ng-container>

      <ng-container matColumnDef="Status">
        <th mat-header-cell *matHeaderCellDef   style="width:5%;text-align:center">Status </th>
        <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
        <div *ngIf = "row.Status">
        {{row.Status.Status}}
        </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="ProcessName" >
        <th mat-header-cell *matHeaderCellDef   style="width:5%;text-align:center">ProcessName </th>
        <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center">
        <div *ngIf = "row.processes">
        <div *ngFor = "let elem of row.processes">
        {{elem.Process.ProcessName}}
        </div>
        </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="ProcessStatus" >
        <th mat-header-cell *matHeaderCellDef   style="width:5%;text-align:center">ProcessStatus </th>
        <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center"> 
        <div *ngIf = "row.processes">
        <div *ngFor = "let elem of row.processes">
        {{elem.Status}}
        </div>
        </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="ReturnToProcess">
        <th mat-header-cell *matHeaderCellDef   style="width:5%;text-align:center">ReturnToProcess </th>
        <td mat-cell *matCellDef="let row"  style="width:5%;text-align:center"> 
        <div *ngIf = "row.reject">
        <div *ngFor = "let elem of row.reject">
        {{elem.ReturnToProcess}}
        </div>
        </div>
        </td>
      </ng-container>
      <ng-container matColumnDef="CreationDate">
      <th mat-header-cell *matHeaderCellDef  style="width:5%;text-align:center">
      CreationDate
      </th>
      <td mat-cell *matCellDef="let row" style="width:5%;text-align:center">
       {{row.EcrNumber.CurrentTimeStamp}}<br>
      </td>
    </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </div>
    </div>
    <div mat-dialog-actions>
        <button mat-button style='font-size:30px;
        background-color:#DCDCDC;width:150px;height:50px' [mat-dialog-close]="">Ok</button>
   </div>
`
})
export class LoguserComponent {

  Ecrnumber = '';
  dataSource: any = [];
  processList: any =[];
  displayedColumns = ['EcrNumber', 'ECRRelease', 'ECRType', 'PartNumber', 'RequestedBy',
                                  'RevisionNumber', 'SerialNumber', 'InformedToProcess',
                                  'Status', 'ProcessName', 'ProcessStatus', 'ReturnToProcess', 'CreationDate'];
  constructor(public dialogRef: MatDialogRef<LoguserComponent>,
    private _ecrService: EcrcreationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.Ecrnumber = localStorage.getItem('logData');
    this.getLog(this.Ecrnumber);
    this.getProcesslist();
  }
  closeDialog() {

    this.dialogRef.close({ event: 'close' });
  }
  dataList: any = [];
  getLog(ECRNumber) {
    this._ecrService.getECNlog(ECRNumber).subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.dataList = result.data;
          this.dataSource = new MatTableDataSource<any>(this.dataList);
        }
      }
    );
  } 

  getProcesslist(){
    this._ecrService.getProcesslist().subscribe(
      (response) => {
        const result = response;
        if (result.code) {
          this.processList = result.data;
          console.log('Process List',this.processList);
        }
      }
    );
  }

}
