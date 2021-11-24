"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.LoguserComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var dialog_1 = require("@angular/material/dialog");
var LoguserComponent = /** @class */ (function () {
    function LoguserComponent(dialogRef, _ecrService, data) {
        this.dialogRef = dialogRef;
        this._ecrService = _ecrService;
        this.data = data;
        this.Ecrnumber = '';
        this.dataSource = [];
        this.processList = [];
        this.displayedColumns = ['EcrNumber', 'ECRRelease', 'ECRType', 'PartNumber', 'RequestedBy',
            'RevisionNumber', 'SerialNumber', 'InformedToProcess',
            'Status', 'ProcessName', 'ProcessStatus', 'ReturnToProcess', 'CreationDate'];
        this.dataList = [];
        this.Ecrnumber = localStorage.getItem('logData');
        this.getLog(this.Ecrnumber);
        this.getProcesslist();
    }
    LoguserComponent.prototype.closeDialog = function () {
        this.dialogRef.close({ event: 'close' });
    };
    LoguserComponent.prototype.getLog = function (ECRNumber) {
        var _this = this;
        this._ecrService.getECNlog(ECRNumber).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.dataList = result.data;
                _this.dataSource = new material_1.MatTableDataSource(_this.dataList);
            }
        });
    };
    LoguserComponent.prototype.getProcesslist = function () {
        var _this = this;
        this._ecrService.getProcesslist().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.processList = result.data;
                console.log('Process List', _this.processList);
            }
        });
    };
    LoguserComponent = __decorate([
        core_1.Component({
            selector: 'UserTextModal',
            template: "<h1 mat-dialog-title class=\"text-center\" style=\"font-size:40px;font-weight: bold;\">Log</h1>\n    <div mat-dialog-content>\n    <div class=\"mat-elevation-z8\">\n    <table mat-table [dataSource]=\"dataSource\" matSort>\n      <ng-container matColumnDef=\"EcrNumber\">\n        <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n        EcrNumber\n        </th>\n        <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\"> \n          {{row.EcrNumber.ECRNumber}}<br>\n        </td>\n      </ng-container>\n    <ng-container matColumnDef=\"ECRRelease\">\n    <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n    ECRRelease\n    </th>\n    <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n    {{row.EcrNumber.ECRRelease}}<br>\n    </td>\n  </ng-container>\n  <ng-container matColumnDef=\"ECRType\">\n    <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n    ECRType\n    </th>\n    <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n      {{row.EcrNumber.ECRType}}<br>\n      </td>\n  </ng-container>\n\n  <ng-container matColumnDef=\"PartNumber\">\n  <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n  PartNumber\n  </th>\n  <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n    {{row.EcrNumber.PartNumber}}<br>\n    </td>\n</ng-container>\n<ng-container matColumnDef=\"RequestedBy\">\n  <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n  RequestedBy\n  </th>\n  <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n   {{row.EcrNumber.RequestedBy}}<br>\n    </td>\n</ng-container>\n<ng-container matColumnDef=\"RevisionNumber\">\n  <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n  RevisionNumber\n  </th>\n  <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n   {{row.EcrNumber.RevisionNumber}}<br>\n </td>\n</ng-container>\n<ng-container matColumnDef=\"SerialNumber\">\n  <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n  SerialNumber\n  </th>\n  <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n  {{row.EcrNumber.SerialNumber}}\n  </td>\n</ng-container>\n\n<ng-container matColumnDef=\"InformedToProcess\">\n  <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n  Informed To Process\n  </th>\n  <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n    <div *ngFor = \"let process of processList\">\n    {{process.ProcessName}}\n    </div>\n  </td>\n</ng-container>\n\n      <ng-container matColumnDef=\"Status\">\n        <th mat-header-cell *matHeaderCellDef   style=\"width:5%;text-align:center\">Status </th>\n        <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n        <div *ngIf = \"row.Status\">\n        {{row.Status.Status}}\n        </div>\n        </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"ProcessName\" >\n        <th mat-header-cell *matHeaderCellDef   style=\"width:5%;text-align:center\">ProcessName </th>\n        <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\">\n        <div *ngIf = \"row.processes\">\n        <div *ngFor = \"let elem of row.processes\">\n        {{elem.Process.ProcessName}}\n        </div>\n        </div>\n        </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"ProcessStatus\" >\n        <th mat-header-cell *matHeaderCellDef   style=\"width:5%;text-align:center\">ProcessStatus </th>\n        <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\"> \n        <div *ngIf = \"row.processes\">\n        <div *ngFor = \"let elem of row.processes\">\n        {{elem.Status}}\n        </div>\n        </div>\n        </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"ReturnToProcess\">\n        <th mat-header-cell *matHeaderCellDef   style=\"width:5%;text-align:center\">ReturnToProcess </th>\n        <td mat-cell *matCellDef=\"let row\"  style=\"width:5%;text-align:center\"> \n        <div *ngIf = \"row.reject\">\n        <div *ngFor = \"let elem of row.reject\">\n        {{elem.ReturnToProcess}}\n        </div>\n        </div>\n        </td>\n      </ng-container>\n      <ng-container matColumnDef=\"CreationDate\">\n      <th mat-header-cell *matHeaderCellDef  style=\"width:5%;text-align:center\">\n      CreationDate\n      </th>\n      <td mat-cell *matCellDef=\"let row\" style=\"width:5%;text-align:center\">\n       {{row.EcrNumber.CurrentTimeStamp}}<br>\n      </td>\n    </ng-container>\n\n      <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\n      <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n    </table>\n  </div>\n    </div>\n    <div mat-dialog-actions>\n        <button mat-button style='font-size:30px;\n        background-color:#DCDCDC;width:150px;height:50px' [mat-dialog-close]=\"\">Ok</button>\n   </div>\n"
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], LoguserComponent);
    return LoguserComponent;
}());
exports.LoguserComponent = LoguserComponent;
