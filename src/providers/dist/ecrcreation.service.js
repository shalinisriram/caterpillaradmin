"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EcrcreationService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../environments/environment");
var ecmURL = environment_1.environment.ecmURL;
;
var EcrcreationService = /** @class */ (function () {
    function EcrcreationService(_httpClient) {
        this._httpClient = _httpClient;
    }
    EcrcreationService.prototype.getClearTemp = function () {
        return this._httpClient.get(ecmURL + '/ClearTemp');
    };
    EcrcreationService.prototype.getSaveEcrForm = function (obj) {
        return this._httpClient.post(ecmURL + '/SaveEcrForm', obj);
    };
    EcrcreationService.prototype.UploadFile = function (obj) {
        return this._httpClient.post(ecmURL + '/UploadFile', obj);
    };
    EcrcreationService.prototype.getInbox = function (obj) {
        return this._httpClient.get(ecmURL + '/ECMInbox?UserName=' + obj);
    };
    EcrcreationService.prototype.getDepartment = function () {
        return this._httpClient.get(ecmURL + '/DeptList');
    };
    EcrcreationService.prototype.getProcesslist = function () {
        return this._httpClient.get(ecmURL + '/ProcessList');
    };
    EcrcreationService.prototype.ProcessList = function (obj) {
        return this._httpClient.post(ecmURL + '/EcmRouting', obj);
    };
    EcrcreationService.prototype.downloadSelectedFile = function (obj) {
        return this._httpClient.post(ecmURL + '/DownloadFile', obj, { responseType: 'blob' });
    };
    EcrcreationService.prototype.RoutedTask = function (obj) {
        return this._httpClient.get(ecmURL + '/RoutedTask?userName=' + obj);
    };
    EcrcreationService.prototype.getDeptProcess = function (obj) {
        return this._httpClient.get(ecmURL + '/GetDeptProcess?EcmStatusId=' + obj);
    };
    EcrcreationService.prototype.approve = function (obj) {
        return this._httpClient.post(ecmURL + '/Approve', obj);
    };
    EcrcreationService.prototype.getGroups = function () {
        return this._httpClient.get(ecmURL + '/GroupAllProcess');
    };
    EcrcreationService.prototype.getEcrs = function (obj) {
        return this._httpClient.get(ecmURL + '/AllEcn?UserName=' + obj);
    };
    EcrcreationService.prototype.getECNlog = function (obj) {
        return this._httpClient.get(ecmURL + '/ECNLog?EcrNumber=' + obj);
    };
    EcrcreationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], EcrcreationService);
    return EcrcreationService;
}());
exports.EcrcreationService = EcrcreationService;
