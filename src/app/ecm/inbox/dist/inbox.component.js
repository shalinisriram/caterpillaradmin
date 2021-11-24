"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InboxComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var log_component_1 = require("./log.component");
var InboxComponent = /** @class */ (function () {
    function InboxComponent(_ecrService, toasterService, dialog, _router) {
        this._ecrService = _ecrService;
        this.toasterService = toasterService;
        this.dialog = dialog;
        this._router = _router;
        this.dataSource = new material_1.MatTableDataSource();
        this.datasourceecr = new material_1.MatTableDataSource();
        this.displayedColumns = ['ECRNumber', 'Description', 'CreationDate', 'EffectiveDate', 'SerialNumber', 'Status', 'PartNumber', 'RevisionNumber',
            'Requested', 'CatJobNumber', 'Type', 'Version', 'FileB'];
        this.displayedColumns1 = ['ECRNumber', 'Description', 'CreationDate', 'EffectiveDate', 'SerialNumber', 'Status', 'PartNumber', 'RevisionNumber',
            'Requested', 'CatJobNumber', 'Type', 'Version', 'log', 'FileB'];
        this.selectedFiles = [];
        this.dataList = [];
        this.isTable = true;
        this.isEdit = false;
        this.isMenue = true;
        this.ecr = {
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
        };
        this.fileDownload = {
            "Filename": "",
            "EcrNumber": "",
            "Version": 0
        };
        this.ecrlists = [];
    }
    InboxComponent.prototype.ngOnInit = function () {
        this.getInbox();
        this.getEcrs();
        // console.log(this.dataSource)
    };
    InboxComponent.prototype.showUpdateForm = function (ecr) {
        if (ecr.SerialNumber == null) {
            ecr.SerialNumber = "";
        }
        this.ecr = __assign({}, ecr.ecr);
        console.log(ecr.ecr.Status);
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
        this._router.navigate(['inbox']);
    };
    InboxComponent.prototype.getLog = function (ecr) {
        localStorage.setItem("logData", ecr.ECRNumber);
        var dialogRef = this.dialog.open(log_component_1.LoguserComponent, {
            width: '90vw',
            height: '40vh',
            data: {}
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) { }
        });
    };
    InboxComponent.prototype.getInbox = function () {
        var _this = this;
        this._ecrService.getInbox(localStorage.getItem("currentUser")).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.dataList = result.data;
                _this.dataSource = new material_1.MatTableDataSource(_this.dataList);
            }
            else {
                _this.dataList = [];
            }
            (function (error) {
                console.log("getInbox()", error);
            });
        });
    };
    InboxComponent.prototype.addEcrCreation = function () {
        this._router.navigate(['ecrcreation']);
        this.getInbox();
        this.getEcrs();
    };
    InboxComponent.prototype.downloadFiles = function (element) {
        this.fileDownload.Filename = element;
        this.fileDownload.EcrNumber = this.ecr.ECRNumber;
        this.fileDownload.Version = this.ecr.Version;
        this._ecrService.downloadSelectedFile(this.fileDownload).subscribe(function (data) {
            var blob = new Blob();
            blob = new Blob([data]);
            var downloadURL = window.URL.createObjectURL(data);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = element;
            link.click();
        });
        this.getInbox();
        this.getEcrs();
    };
    InboxComponent.prototype.getEcrs = function () {
        var _this = this;
        this._ecrService.getEcrs(localStorage.getItem('currentUser')).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.ecrlists = result.data;
                _this.datasourceecr = new material_1.MatTableDataSource(_this.ecrlists);
            }
        });
    };
    InboxComponent = __decorate([
        core_1.Component({
            selector: 'app-inbox',
            templateUrl: './inbox.component.html',
            styleUrls: ['./inbox.component.css']
        })
    ], InboxComponent);
    return InboxComponent;
}());
exports.InboxComponent = InboxComponent;
