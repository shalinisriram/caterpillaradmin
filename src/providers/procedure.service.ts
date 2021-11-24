import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";

const unitUrl = environment.unitUrl;
const uploadUrl = environment.uploadUrl;
@Injectable()
export class ProcedureService {
    constructor(private _httpClient: HttpClient) { }

    getProcedures(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'FilterProcedures', obj);
    }

    addProcedure() {
        return this._httpClient.get<itemResponse>(uploadUrl + 'LatestProcedureDb');
    }

    addEcr(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'EcrImplementation', obj);
    }
    getAreaListSection(section) {
      return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllAreasWithSection',section);
    }

    validateProcedure(obj){
        return this._httpClient.post<itemResponse>(uploadUrl + 'ValidateProcedures', obj);
    }
    validateProcedureQ(obj){
        return this._httpClient.post<itemResponse>(uploadUrl + 'validateQrocedure', obj);
    }


    updateProcedure(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'EditProcedures', obj);
    }

    InserProcedure(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'InsertProcedure', obj);
    }


    deleteProcedures(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'DeleteProcedures', obj);
    }

    getImage(url){
        return this._httpClient.get(url,{responseType:'blob'});
    }

    getUnit() {
        return this._httpClient.get(unitUrl + 'Unit/LineLoad');
    }

    getSections() {
        return this._httpClient.get<itemResponse>(unitUrl + 'Unit/SectionsList');
    }

    getModels(section,user) {

        return this._httpClient.get<itemResponse>(unitUrl + 'Unit/ModelList?section=' + section +'&username='+user);
    }

    getComponents(obj) {
        return this._httpClient.post<itemResponse>(unitUrl + 'Admin/ComponentList',obj);
    }

    getAreas(user) {
        return this._httpClient.get<itemResponse>(unitUrl + 'Unit/GetArea?UserName='+user);
    }
    getAudiName(obj)
    {
        return this._httpClient.post<itemResponse>(unitUrl + 'Admin/AuditNAmeList',obj);

    }
    Areas() {
        return this._httpClient.get<itemResponse>(unitUrl + 'Admin/Area');
    }

    clearTemp(){
        return this._httpClient.get<itemResponse>(uploadUrl + 'ClearTemp');
    }
    imageUpload2(csvs) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'UploadCsv', csvs);
    }

    getFilterAuditSequence(obj)
    {
        return this._httpClient.post<itemResponse>(uploadUrl + 'FilterAuditSequences', obj);
    }
    getAllAreaWithSection(obj)
    {
        return this._httpClient.get<itemResponse>(uploadUrl + 'GetAllAreaWithSection?section='+obj);
    }

    getAreaList() {
        return this._httpClient.get<itemResponse>(uploadUrl + 'AllArea');
    }

    getModelList() {
        return this._httpClient.get<itemResponse>(uploadUrl + 'AllCATModel');
    }

    getSectionList() {
        return this._httpClient.get<itemResponse>(uploadUrl + 'AllSection');
    }
    getComponentList() {
        return this._httpClient.get<itemResponse>(uploadUrl + 'AllComponent');
    }

    getVersionList(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'Versions',obj);
    }
    getQualityVersionList(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'QualityVersions',obj);
    }

    imageUpload(images){
        return this._httpClient.post<itemResponse>(uploadUrl + 'UploadImages', images).toPromise();
    }

    SingleimageUpload(images){
        return this._httpClient.post<itemResponse>(uploadUrl + 'UploadImages', images);
    }
    getSplInstructionVersionList(obj) {
        return this._httpClient.post<itemResponse>(uploadUrl + 'SplInstructionVersion',obj);
    }

    exportToword(obj)
    {
        return this._httpClient.post(uploadUrl + 'ExportToWord',obj, { responseType: 'blob' });
    }
}

export interface itemResponse {
    status: '',
    code: '',
    message: '',
    data: ''
}
