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
exports.UserComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var sweetalert2_1 = require("sweetalert2");
var collections_1 = require("@angular/cdk/collections");
var forms_1 = require("@angular/forms");
var UserComponent = /** @class */ (function () {
    function UserComponent(fb, _userService, _areaService, _ecmService, breakpointObserver, toastr) {
        var _this = this;
        this.fb = fb;
        this._userService = _userService;
        this._areaService = _areaService;
        this._ecmService = _ecmService;
        this.toastr = toastr;
        this.isTable = true;
        this.isEdit = false;
        this.isAdd = false;
        this.userList = [];
        // displayedColumns: string[] = ['UserName', 'Password', 'RoleType','Department', 'Section', 'Area','loginGroups','Process','Permission', 'IsActive','Select'];
        this.displayedColumns = ['UserName', 'Password', 'RoleType', 'Department', 'Section',
            'Area', 'Process', 'Permission', 'IsActive', 'Select'];
        this.userStatusList = ['Active', 'Inactive'];
        this.dataSource = new material_1.MatTableDataSource();
        this.selection = new collections_1.SelectionModel(true, []);
        this.roleList = ['Admin', 'User'];
        this.user = {
            'UserName': '',
            'Password': '',
            'DepartmentId': '',
            'Area': [],
            'Groups': [],
            'Permission': [],
            'Section': [],
            'RoleType': 'Admin',
            'IsActive': 'true'
        };
        this.sectionList = [];
        this.areaList = [];
        this.processList = [];
        this.departmentList = [];
        this.permissionlist = [];
        this.groupList = [];
        this.groupListEdit = [];
        this.processEdit = [];
        this.permisiionEdit = [];
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(function (result) {
            _this.displayedColumns = result.matches ?
                ['UserName', 'Password', 'RoleType', 'Department', 'Section', 'Area', 'Process', 'Permission', 'IsActive', 'Select'] :
                ['UserName', 'Password', 'RoleType', 'Department', 'Section', 'Area', 'Process', 'Permission', 'IsActive', 'Select'];
        });
    }
    UserComponent.prototype.ngOnInit = function () {
        this.form = this.fb.group({
            UserName: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            Password: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            RoleType: [null, forms_1.Validators.compose([forms_1.Validators.required])]
        });
        this.getUsers();
        this.getGroup();
        this.getSections();
        this.getAreas();
        this.getProcess();
        this.getPermission();
        this.getDepartments();
    };
    UserComponent.prototype.getPermission = function () {
        var _this = this;
        this._areaService.getPermission().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.permissionlist = result.data;
            }
        });
    };
    UserComponent.prototype.getDepartments = function () {
        var _this = this;
        this._ecmService.getDepartment().subscribe(function (response) {
            var result = response;
            console.log('Department List Result', response);
            if (result.code) {
                // const dept: any = result.data;
                // dept.forEach(element => {
                //   this.departmentList.push(element.DepartmentName);
                // });
                _this.departmentList = result.data;
                console.log('Department List', _this.departmentList);
            }
        });
    };
    UserComponent.prototype.getProcess = function () {
        var _this = this;
        this._ecmService.getProcesslist().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.Process = result.data;
                _this.Process.forEach(function (element) {
                    _this.processList.push(element.ProcessName);
                });
            }
        });
    };
    UserComponent.prototype.getGroup = function () {
        var _this = this;
        this._userService.getgroups().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.groupList = result.data;
            }
        });
    };
    UserComponent.prototype.getUsers = function () {
        var _this = this;
        this._userService.getUsers().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.userList = result.data;
                console.log('userList', _this.userList);
                _this.dataSource = new material_1.MatTableDataSource(_this.userList);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }
            else {
                _this.userList = [];
            }
        }, function (error) {
            console.log('getUsers()', error);
        });
    };
    UserComponent.prototype.getSections = function () {
        var _this = this;
        this._userService.getSections().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.sectionList = result.data;
            }
            else {
                _this.sectionList = [];
            }
        }, function (error) {
            console.log(error, 'getSections()');
        });
    };
    UserComponent.prototype.getAreas = function () {
        var _this = this;
        this._areaService.getAreas().subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.areaList = result.data;
            }
            else {
                _this.areaList = [];
            }
        }, function (error) {
            console.log(error, 'getAreas()');
        });
    };
    UserComponent.prototype.addUser = function (f) {
        var _this = this;
        console.log('Add User', this.user);
        this._userService.addUser(this.user).subscribe(function (response) {
            var result = response;
            console.log('Add User Result', _this.user);
            if (result.code) {
                _this.toastr.success(result.message, 'Success');
                _this.isAdd = false;
                _this.isTable = true;
                _this.getUsers();
                f.resetForm();
            }
            else {
                _this.toastr.error(result.message, 'Error');
                _this.isAdd = false;
                _this.isTable = true;
                _this.getUsers();
                f.resetForm();
            }
        }, function (error) {
            console.log('addUser()', error);
        });
    };
    UserComponent.prototype.showUpdateForm = function (user) {
        var _this = this;
        console.log('Update User', user);
        this.user = __assign({}, user);
        user.loginDepts.forEach(function (element) {
            _this.processEdit.push(element.ProcessName);
        });
        user.loginPermission.forEach(function (element) {
            _this.permisiionEdit.push(element.PermissionName);
        });
        // user.loginGroups.forEach(element => {
        //   this.groupListEdit.push(element.GroupName)
        // }); 
        this.user.Process = this.processEdit;
        // this.user.Groups = this.groupListEdit
        this.user.Permission = this.permisiionEdit;
        this.isTable = false;
        this.isEdit = true;
        this.getSections();
        this.getAreas();
    };
    UserComponent.prototype.updateUser = function (f) {
        var _this = this;
        this.user.Area = this.user.Area == "" ? [] : this.user.Area;
        console.log('ModifiedUser', this.user);
        this._userService.updateUser(this.user).subscribe(function (response) {
            var result = response;
            if (result.code) {
                _this.toastr.success(result.message, 'Success');
                _this.isEdit = false;
                _this.isTable = true;
                _this.getUsers();
                f.resetForm();
            }
            else {
                _this.toastr.error(result.message, 'Error');
                _this.isEdit = false;
                _this.isTable = true;
                _this.getUsers();
                f.resetForm();
            }
        }, function (error) {
            console.log('updateUser()', error);
        });
    };
    UserComponent.prototype.deleteUsers = function () {
        var _this = this;
        this.selectedItemIds = [];
        this.selection.selected.forEach(function (ele) {
            _this.selectedItemIds.push(ele.Id);
        });
        sweetalert2_1["default"].fire({
            title: 'Info',
            text: 'Do you want to delete the selected Users?',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            showCloseButton: true
        }).then(function (result) {
            if (result.value) {
                var obj = {
                    'Ids': _this.selectedItemIds
                };
                _this._userService.deleteUsers(obj).subscribe(function (response) {
                    var result = response;
                    if (result.code) {
                        sweetalert2_1["default"].fire('Deleted!', 'Users have been deleted!', 'success');
                        _this.selection = new collections_1.SelectionModel(true, []);
                        _this.getUsers();
                    }
                    else {
                        _this.toastr.error(result.message, 'Error');
                        _this.getUsers();
                    }
                }, function (error) {
                    console.log('deleteUsers()', error);
                });
            }
        });
    };
    UserComponent.prototype.applyFilter = function (filterValue) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    };
    UserComponent.prototype.isAllSelected = function () {
        var numSelected = this.selection.selected.length;
        var numRows = this.dataSource.data.length;
        return numSelected === numRows;
    };
    UserComponent.prototype.masterToggle = function () {
        var _this = this;
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(function (row) { return _this.selection.select(row); });
    };
    UserComponent.prototype.checkboxLabel = function (row) {
        if (!row) {
            return (this.isAllSelected() ? 'select' : 'deselect') + " all";
        }
        return (this.selection.isSelected(row) ? 'deselect' : 'select') + " row " + (row.position + 1);
    };
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], UserComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], UserComponent.prototype, "sort");
    UserComponent = __decorate([
        core_1.Component({
            selector: 'app-user',
            templateUrl: './user.component.html',
            styleUrls: ['./user.component.css']
        })
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
