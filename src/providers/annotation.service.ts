import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;
const QualityUrl = environment.QualityUrl;

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {

  constructor(private _httpClient: HttpClient) { }
  getAnnotation() {
    return this._httpClient.get(adminURL + '/Annotations');
  }

  getSectionWithId() {
    return this._httpClient.get<itemResponse>(adminURL + '/GetSectionWithId');
  }
  getModelWithId() {
    return this._httpClient.get<itemResponse>(adminURL + '/GetModelWithId');
  }
  getAreaWithId() {
    return this._httpClient.get<itemResponse>(adminURL + '/GetAreaWithId');
  }
  getComponentWithId() {
    return this._httpClient.get<itemResponse>(adminURL + '/GetComponentWithId');
  }
  addAnnotation(obj) {
    return this._httpClient.post(adminURL + '/Annotations', obj);
  }
  UpdateAnnotation(obj) {
    return this._httpClient.put(adminURL + '/Annotations', obj);
  }
  deleteAnnotations(id) {
    return this._httpClient.delete(adminURL + '/Annotations/' + id);
  }
  getImage(id) {
    return this._httpClient.get<itemResponse>(QualityUrl + 'QualityInstruction/' + id);


  }


  getQualityInstructions(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/QualityInstructions', obj);
  }
  getDefects(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/Defects', obj);
  }
  getFilterDefects(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/FilteredDefects', obj);
  }
  addDefects(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/UpdateDefect', obj);

  }
  addQualityInstruction() {
    return this._httpClient.get<itemResponse>(adminURL + '/AddQualityInstructionS');
  }
  EditQualityInstruction(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/EditQuality', obj);
  }
  EditSpclInstr(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/EditSpclInstr', obj);
  }

  getGroups() {
    return this._httpClient.get<itemResponse>(adminURL + '/Groups');
  }

  getEdit(obj) {
    return this._httpClient.get<itemResponse>(adminURL + '/EditGroup?GroupName=' + obj.GroupName + '&id=' + obj.Id);
  }
  Delete(id) {
    return this._httpClient.get<itemResponse>(adminURL + '/DeleteGroup?id=' + id);

  }
  AddGroups(obj) {
    return this._httpClient.get<itemResponse>(adminURL + '/AddGroup?GroupName=' + obj);

  }
  getAuidSequence() {
    return this._httpClient.get<itemResponse>(adminURL + '/AuditSequences');

  }
  updateAuditSequence(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/UpdateAuditSequences', obj);

  }

  addAuditsequence(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddAuditSequences', obj);

  }

  deleteAuditsequence(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/DeleteAuditSequence', obj);
  }
  getModel() {
    return this._httpClient.get<itemResponse>(adminURL + '/AllCATModel');

  }
  getSpclInstr(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/SplInstructions', obj);
  }
  addSpclInstr(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddSplInstructions', obj);

  }
  getCycle() {
    return this._httpClient.get<itemResponse>(adminURL + '/CycleTimeList');

  }

  addCycle(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddCycleTime', obj);
  }

  updateCycle(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/UpdateCycle', obj);

  }

  deleteCycle(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/DeleteCycleTime', obj);

  }

}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
