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
exports.RoutingecnsComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var user_component_1 = require("./user.component");
var RoutingecnsComponent = /** @class */ (function () {
    function RoutingecnsComponent(_ecrService, breakpointObserver, _router, dialog, toasterService, shared) {
        var _this = this;
        this._ecrService = _ecrService;
        this._router = _router;
        this.dialog = dialog;
        this.toasterService = toasterService;
        this.shared = shared;
        this.dataSource = new material_1.MatTableDataSource();
        this.isTable = true;
        this.isEdit = false;
        this.displayedColumns = ['ECRNumber', 'ECRRelease', 'EcmStatus', 'Version', 'RoutedBy', 'DateTime', 'RejectedUser', 'ReworkComments'];
        this.displayedcheckListColumns = ['checkpoint', 'state'];
        this.selectedFiles = [];
        this.DepartmentList = [];
        this.ProcessList = [];
        this.routing = {
            "EcmStatusId": 0,
            "ProcessId": 0,
            "SelectedCheckLists": [],
            "comment": " ",
            "isApproved": Boolean,
            "ReturnTo": "",
            "UserName": localStorage.getItem('currentUser')
        };
        this.ecr = {
            "Id": 0,
            "ECRNumber": "",
            "Description": "",
            "EffectiveDate": "",
            "SerialNumber": "",
            "PartNumber": "",
            "RevisionNumber": "",
            "RequestedBy": "",
            "Files": "string",
            "CatJobNumber": "",
            "ECRType": "",
            "UserName": "string",
            "Version": "string",
            "CurrentTimeStamp": Date,
            "ECRRelease": "string",
            "isDisable": Boolean
        };
        this.dataDepart = [];
        this.dataProcess = [];
        this.routedList = [];
        this.process = [];
        this.selectedItems = [];
        this.processLists = {
            "processName": '',
            "checkList": []
        };
        this.fileDownload = {
            "Filename": "string",
            "EcrNumber": "string",
            "Version": 0
        };
        this.loginDepartment = [];
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(function (result) {
            _this.displayedColumns = result.matches ?
                ['ECRNumber', 'ECRRelease', 'EcmStatus', 'Version', 'RoutedBy', 'DateTime', 'RejectedUser', 'ReworkComments'] :
                ['ECRNumber', 'ECRRelease', 'EcmStatus', 'Version', 'RoutedBy', 'DateTime', 'RejectedUser', 'ReworkComments'];
        });
    }
    RoutingecnsComponent.prototype.ngOnInit = function () {
        this.loginDepartment = JSON.parse(localStorage.getItem('Process'));
        this.getRouting();
        this.getProcesslist();
    };
    RoutingecnsComponent.prototype.getRouting = function () {
        var _this = this;
        this.user = localStorage.getItem("currentUser");
        this._ecrService.RoutedTask(this.user).subscribe(function (response) {
            var result = response;
            console.log(result);
            if (result.code) {
                _this.routedList = result.data;
                _this.dataSource = new material_1.MatTableDataSource(_this.routedList);
            }
        });
    };
    RoutingecnsComponent.prototype.showUpdateForm = function (ecr) {
        if (ecr.EChangeRecord.SerialNumber == null) {
            this.ecr.SerialNumber = "Empty";
        }
        this.ecr = __assign({}, ecr.EChangeRecord);
        this.isTable = false;
        this.isEdit = true;
        this.ecr.isDisable = true;
        this.EcmStatusId = ecr.EcmStatusId;
        this.getDeptProcess();
    };
    RoutingecnsComponent.prototype.downloadFiles = function (element) {
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
    };
    RoutingecnsComponent.prototype.getRoutingTable = function () {
        this._router.navigate(['routingecns']);
    };
    RoutingecnsComponent.prototype.getDeptProcess = function () {
        var _this = this;
        this._ecrService.getDeptProcess(this.EcmStatusId).subscribe(function (response) {
            var result = response;
            if (result.code) {
                console.log(result.data);
                _this.dataDepart = result.data['departments'];
                _this.DepartmentList.push(_this.dataDepart);
                _this.dataProcess = result.data['processEcm'];
                _this.dataSourceProcessStatusList = _this.dataProcess;
                _this.dataProcess.forEach(function (element) {
                    _this.ProcessList.push(element.Process);
                });
                localStorage.setItem("processlist", JSON.stringify(_this.ProcessList));
            }
        });
    };
    RoutingecnsComponent.prototype.getApproveReject = function () {
        var _this = this;
        var process = [];
        this.ProcessList.forEach(function (element) {
            process.push(element.ProcessName);
        });
        this.shared.updateList(process);
        var dialogRef = this.dialog.open(user_component_1.QualityuserComponent, {
            width: '40vw',
            height: '45vh',
            data: {}
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                _this.routing.comments = res.data,
                    _this.routing.EcmStatusId = _this.EcmStatusId,
                    _this.routing.ReturnTo = localStorage.getItem('reject'),
                    _this.routing.SelectedCheckLists = _this.selectedItems,
                    _this.routing.ProcessId = _this.loginDepartment[0],
                    _this.routing.isApproved = _this.isApprove,
                    _this._ecrService.approve(_this.routing).subscribe(function (response) {
                        var result = response;
                        if (result.code) {
                            _this.toasterService.success('Status Updated', 'Success');
                        }
                    });
            }
        });
    };
    RoutingecnsComponent.prototype.openUserTextModal = function () {
    };
    RoutingecnsComponent.prototype.getApprove = function () {
        var _this = this;
        this.routing.EcmStatusId = this.EcmStatusId;
        this.routing.SelectedCheckLists = this.selectedItems;
        this.routing.ProcessId = this.loginDepartment[0];
        this.routing.isApproved = this.isApprove;
        this._ecrService.approve(this.routing).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.toasterService.success('Status Updated', 'Success');
                _this.getRouting();
            }
        });
    };
    RoutingecnsComponent.prototype.selected_Group = function (e, model, v) {
        console.log(v);
        if (v == "passed") {
            console.log(model);
            this.selectedItems.push(model.Id);
        }
    };
    RoutingecnsComponent.prototype.getProcesslist = function () {
        var _this = this;
        this._ecrService.getProcesslist().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.process = result.data;
                //console.log(this.loginDepartment.slice(0, 1)[0]);
                _this.process.forEach(function (element) {
                    if (element.Id == (_this.loginDepartment.slice(0, 1)[0])) {
                        _this.processLists.processName = element.ProcessName;
                        localStorage.setItem("processLists", _this.processLists.processName);
                        _this.processLists.checkList = element.CheckLists;
                        console.log(_this.processLists.checkList);
                    }
                });
            }
            //console.log(this.selectedItems);
        }),
            function (error) {
                console.log('getProcesslist()', error);
            };
    };
    RoutingecnsComponent = __decorate([
        core_1.Component({
            selector: 'app-routingecns',
            templateUrl: './routingecns.component.html',
            styleUrls: ['./routingecns.component.css']
        })
    ], RoutingecnsComponent);
    return RoutingecnsComponent;
}());
exports.RoutingecnsComponent = RoutingecnsComponent;
