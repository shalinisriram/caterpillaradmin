"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EcrcreationComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var EcrcreationComponent = /** @class */ (function () {
    function EcrcreationComponent(fb, _ecrService, toasterService, _router, _procedureService, route) {
        this.fb = fb;
        this._ecrService = _ecrService;
        this.toasterService = toasterService;
        this._router = _router;
        this._procedureService = _procedureService;
        this.route = route;
        this.date = new forms_1.FormControl(new Date());
        this.serializedDate = new forms_1.FormControl((new Date()).toISOString());
        this.browseFiles = [];
        this.Departmentlist = [];
        this.ProcessLists = [];
        this.OpertionList = [];
        this.isEcrForm = true;
        this.isEcrRouting = false;
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
            "CurrentTimeStamp": Date,
            "ECRRelease": "",
            "isDisable": false
        };
        this.ProcessList = [];
        this.groupSelectedList = [];
        this.routingGroupPr = [];
        this.routingGroup = {
            "Process": '',
            "Groups": []
        };
        this.SectionList = [];
        this.ecrrouting = {
            "EcrNumber": '',
            "Depts": '',
            "Section": '',
            "ProcessNames": this.routingGroupPr
        };
        this.Database = [];
        this.types = [
            'Engineering change',
            'Process',
            'Deviation',
            'npi'
        ];
        this.process = [];
        this.groupList = [];
    }
    EcrcreationComponent.prototype.ngOnInit = function () {
        console.log(this.ecr.isDisable);
        this.form = this.fb.group({
            ECRNumber: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            Description: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            EffectiveDate: [null],
            SerialNumber: [null],
            PartNumber: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            RevisionNumber: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            RequestedBy: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            CatJobNumber: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            ECRType: [null, forms_1.Validators.compose([forms_1.Validators.required])]
        });
        this.routingGroupPr = [];
        this.getProcesslist();
        this.populateDepartmentList();
        this.getProcessGroup();
        this.getSectionList();
    };
    EcrcreationComponent.prototype.populateDepartmentList = function () {
        var _this = this;
        this._ecrService.getDepartment().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.Departmentlist = result.data;
            }
        });
    };
    EcrcreationComponent.prototype.getSectionList = function () {
        var _this = this;
        this._procedureService.getSectionList().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.SectionList = result.data;
            }
            else {
                _this.SectionList = [];
            }
        }, function (error) {
            console.log(error, ' getSectionList()');
        });
    };
    EcrcreationComponent.prototype.onFileChanged = function (event) {
        this.browseFiles = event.target.files;
    };
    EcrcreationComponent.prototype.getClearTemp = function () {
        var _this = this;
        this._ecrService.getClearTemp().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.ecr.Id = 0;
                _this.ecr.ECRNumber = "";
                _this.ecr.Description = "";
                _this.ecr.EffectiveDate = "";
                _this.ecr.SerialNumber = "";
                _this.ecr.PartNumber = "";
                _this.ecr.RevisionNumber = "";
                _this.ecr.RequestedBy = "";
                _this.ecr.CatJobNumber = "";
                _this.ecr.ECRType = "";
                _this.ecr.Files = _this.browseFiles.length == 0 ? "" : _this.browseFiles[0].name;
                _this.ecr.UserName = localStorage.getItem('currentUser');
                _this.ecr.CurrentTimeStamp = new Date();
            }
            else { }
        }, function (error) {
            console.log('getClearTemp()', error);
        });
    };
    EcrcreationComponent.prototype.getEcrFormData = function () {
        this.ecr.Id = 0;
        this.ecr.ECRNumber = this.form.value.ECRNumber;
        this.ecr.Description = this.form.value.Description;
        this.ecr.EffectiveDate = this.form.value.EffectiveDate;
        this.ecr.SerialNumber = this.form.value.SerialNumber;
        this.ecr.PartNumber = this.form.value.PartNumber;
        this.ecr.RevisionNumber = this.form.value.RevisionNumber;
        this.ecr.RequestedBy = this.form.value.RequestedBy;
        this.ecr.CatJobNumber = this.form.value.CatJobNumber;
        this.ecr.ECRType = this.form.value.ECRType;
        this.ecr.Files = this.browseFiles.length == 0 ? this.ecr.Files : this.browseFiles[0].name;
        this.ecr.UserName = localStorage.getItem('currentUser');
        this.ecr.CurrentTimeStamp = new Date();
    };
    EcrcreationComponent.prototype.getInbox = function () {
        var _this = this;
        this._router.navigate(['inbox']);
        this._router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
        var currentUrl = this._router.url + '?';
        if (currentUrl == "/inbox?") {
            this._router.navigateByUrl(currentUrl)
                .then(function () {
                _this._router.navigated = false;
                _this._router.navigate([_this._router.url]);
            });
        }
    };
    EcrcreationComponent.prototype.getSaveEcrForm = function () {
        var _this = this;
        this.ecr.ECRRelease = "save";
        this.getEcrFormData();
        var ecrdata = {
            "Id": this.ecr.Id,
            "ECRNumber": this.ecr.ECRNumber,
            "Description": this.ecr.Description,
            "EffectiveDate": this.ecr.EffectiveDate,
            "SerialNumber": this.ecr.SerialNumber,
            "PartNumber": this.ecr.PartNumber,
            "RevisionNumber": this.ecr.RevisionNumber,
            "RequestedBy": this.ecr.RequestedBy,
            "CatJobNumber": this.ecr.CatJobNumber,
            "ECRType": this.ecr.ECRType,
            "Files": this.ecr.Files,
            "UserName": this.ecr.UserName,
            "CurrentTimeStamp": this.ecr.CurrentTimeStamp,
            "ECRRelease": this.ecr.ECRRelease
        };
        this.uploadFiles();
        console.log(this.ecr);
        this._ecrService.getSaveEcrForm(ecrdata).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.toasterService.success('Saved', 'Success');
            }
            else {
                _this.toasterService.error("Failed to save", "Error");
            }
        }, function (error) {
            console.log('getSaveEcrForm()', error);
        });
        this.getInbox();
    };
    EcrcreationComponent.prototype.getSubmit = function () {
        var _this = this;
        this.getSectionList();
        this.ecr.ECRRelease = "release";
        this.getEcrFormData();
        var ecrdata = {
            "Id": this.ecr.Id,
            "ECRNumber": this.ecr.ECRNumber,
            "Description": this.ecr.Description,
            "EffectiveDate": this.ecr.EffectiveDate,
            "SerialNumber": this.ecr.SerialNumber,
            "PartNumber": this.ecr.PartNumber,
            "RevisionNumber": this.ecr.RevisionNumber,
            "RequestedBy": this.ecr.RequestedBy,
            "CatJobNumber": this.ecr.CatJobNumber,
            "ECRType": this.ecr.ECRType,
            "Files": this.ecr.Files,
            "UserName": this.ecr.UserName,
            "CurrentTimeStamp": this.ecr.CurrentTimeStamp,
            "ECRRelease": this.ecr.ECRRelease
        };
        this.uploadFiles();
        this._ecrService.getSaveEcrForm(ecrdata).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.toasterService.success('Submit', 'Success');
            }
            else {
                _this.toasterService.error("Failed to submit", "Error");
            }
        }, function (error) {
            console.log('getSubmit()', error);
        });
    };
    EcrcreationComponent.prototype.uploadFiles = function () {
        // console.log(this.browseFiles);
        if (this.browseFiles.length == 0)
            return;
        for (var i = 0; i < this.browseFiles.length; i++) {
            var uploadData = new FormData();
            uploadData.append('File', this.browseFiles[i]);
            this._ecrService.UploadFile(uploadData).subscribe(function (data) { return data; });
        }
    };
    EcrcreationComponent.prototype.getProcesslist = function () {
        this._ecrService.getProcesslist().subscribe(function (response) {
            var result = response;
            if (result.code) {
            }
        }),
            function (error) {
                console.log('getProcesslist()', error);
            };
        localStorage.setItem("process", JSON.stringify(this.ProcessLists));
    };
    EcrcreationComponent.prototype.triggerFalseClick = function () {
        var el = this.myDiv.nativeElement;
        el.click();
    };
    EcrcreationComponent.prototype.getProcessGroup = function () {
        var _this = this;
        this.groupList = [];
        this._ecrService.getGroups().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.process = result.data;
            }
            else {
                _this.groupList = [];
            }
        });
        (function (error) {
            console.log("getGroups", error);
        });
    };
    EcrcreationComponent.prototype.processListRout = function () {
        var _this = this;
        this.ecrrouting.EcrNumber = this.form.value.ECRNumber;
        this.ecrrouting.ProcessNames = this.routingGroupPr;
        console.log('processListRout', this.ecrrouting);
        this._ecrService.ProcessList(this.ecrrouting).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.toasterService.success("Routed Successful", "Success");
            }
            else {
                _this.toasterService.error("Routed Failed", "Error");
            }
        }, function (error) {
            console.log('processListRout()', error);
        });
    };
    EcrcreationComponent.prototype.selected_chart = function (input, Process) {
        var existproc = this.routingGroupPr.filter(function (x) { return x.Process == Process; })[0];
        if (existproc != undefined) {
            if (input.checked == false) {
                for (var _i = 0, _a = this.routingGroupPr; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var index = this.routingGroupPr.indexOf(item, 0);
                    if (index > -1) {
                        this.routingGroupPr.splice(index, 1);
                    }
                }
            }
        }
        else {
            if (input.checked == true) {
                var prGr = {};
                prGr.Process = Process;
                prGr.Groups = [];
                this.routingGroupPr.push(prGr);
            }
        }
    };
    EcrcreationComponent.prototype.selected_Group = function (input, Process, i, groupName) {
        var existproc = this.routingGroupPr.filter(function (x) { return x.Process == Process; })[0];
        if (existproc != undefined) {
            if (input.checked == true) {
                for (var _i = 0, _a = this.routingGroupPr; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.Process == Process) {
                        item.Groups.push(groupName);
                    }
                }
            }
            else {
                for (var _b = 0, _c = this.routingGroupPr; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (item.Process == Process) {
                        var index = item.Groups.indexOf(groupName, 0);
                        if (index > -1) {
                            item.Groups.splice(index, 1);
                        }
                    }
                }
            }
        }
        else {
            if (input.checked === true) {
                var prGr = {};
                prGr.Process = Process;
                prGr.Groups = [];
                prGr.Groups.push(groupName);
                this.routingGroupPr.push(prGr);
                var ch = document.getElementById(i);
                ch.checked = true;
            }
            else {
                var ch = document.getElementById(i);
                ch.checked = false;
            }
        }
        console.log(this.routingGroupPr);
    };
    __decorate([
        core_1.Input('data')
    ], EcrcreationComponent.prototype, "ecr");
    __decorate([
        core_1.ViewChild('myDiv')
    ], EcrcreationComponent.prototype, "myDiv");
    EcrcreationComponent = __decorate([
        core_1.Component({
            selector: 'app-ecrcreation',
            templateUrl: './ecrcreation.component.html',
            styleUrls: ['./ecrcreation.component.css']
        })
    ], EcrcreationComponent);
    return EcrcreationComponent;
}());
exports.EcrcreationComponent = EcrcreationComponent;
