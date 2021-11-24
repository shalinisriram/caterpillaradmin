"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(fb, toasterService, _router, _authservice) {
        this.fb = fb;
        this.toasterService = toasterService;
        this._router = _router;
        this._authservice = _authservice;
        this.currentUser = {};
        this.Permissions = [];
        this.roles = ['User', 'QualityAuditor', 'operator'];
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.form = this.fb.group({
            UserName: [null, forms_1.Validators.compose([forms_1.Validators.required])],
            Password: [null, forms_1.Validators.compose([forms_1.Validators.required])]
        });
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.currentUser['UserName'] = this.form.value.UserName,
            this.currentUser['Password'] = this.form.value.Password,
            this._authservice.validate_user(this.currentUser).subscribe(function (response) {
                console.log('Login Result', response);
                var result = response;
                if (result.code) {
                    localStorage.setItem('jwtToken', result.data['Token']);
                    localStorage.setItem('currentUser', result.data['UserName']);
                    localStorage.setItem('RoleType', result.data['RoleType']);
                    localStorage.setItem('Permissions', result.data['Permissions']);
                    localStorage.setItem('Process', JSON.stringify(result.data['Process']));
                    _this.toasterService.success("Login Successful", "Success");
                    _this.Permissions = localStorage.getItem('Permissions');
                    if (_this.Permissions.includes("Operations") || _this.Permissions.includes("AdminOperations")) {
                        _this._router.navigate(['traceability']);
                    }
                    else if (_this.Permissions.includes("Ecm") || _this.Permissions.includes("AdminEcm")) {
                        _this._router.navigate(['inbox']);
                    }
                    else {
                        _this._router.navigate(['inbox']);
                    }
                }
                else {
                    _this.toasterService.error("Login Failed", "Error");
                }
            }, function (error) {
                console.log('onSubmit()', error);
            });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
