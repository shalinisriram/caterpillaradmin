import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

const ecmURL = environment.ecmURL;;
@Injectable({
  providedIn: 'root'
})
export class EcrcreationService {

  constructor(private _httpClient: HttpClient) { }

  getClearTemp() {
    return this._httpClient.get<itemResponse>(ecmURL + '/ClearTemp');
  }

  getSaveEcrForm(obj) {
    return this._httpClient.post<itemResponse>(ecmURL + '/SaveEcrForm', obj)
  }

  UploadFile(obj) {

    return this._httpClient.post<itemResponse>(ecmURL + '/UploadFile', obj);
  }

  getInbox(obj) {
    return this._httpClient.get<itemResponse>(ecmURL + '/ECMInbox?UserName=' + obj)
  }

  getDepartment() {
    return this._httpClient.get<itemResponse>(ecmURL + '/DeptList');
  }
  getProcesslist() {
    return this._httpClient.get<itemResponse>(ecmURL + '/ProcessList')
  }
  ProcessList(obj) {

    return this._httpClient.post<itemResponse>(ecmURL + '/EcmRouting', obj);
  }

  downloadSelectedFile(obj) {
    return this._httpClient.post(ecmURL + '/DownloadFile', obj, { responseType: 'blob' });
  }

  RoutedTask(obj) {
    return this._httpClient.get<itemResponse>(ecmURL + '/RoutedTask?userName=' + obj)
  }

  getDeptProcess(obj) {
    return this._httpClient.get<itemResponse>(ecmURL + '/GetDeptProcess?EcmStatusId=' + obj)
  }

  approve(obj) {
    return this._httpClient.post<itemResponse>(ecmURL + '/Approve', obj);
  }
  getGroups() {
    return this._httpClient.get<itemResponse>(ecmURL + '/GroupAllProcess');

  }
  getDownloadProcessFile(obj)
  {
    return this._httpClient.post(ecmURL + '/DownloadProcessFile', obj, { responseType: 'blob' });
  }

  getEcrs(obj) { 
    return this._httpClient.get<itemResponse>(ecmURL + '/AllEcn?UserName=' + obj);
  }

  getECNlog(obj) {
    return this._httpClient.get<itemResponse>(ecmURL + '/ECNLog?EcrNumber=' + obj);
  }
  approveOriginator(obj) {
    return this._httpClient.post<itemResponse>(ecmURL + '/ReturnToOriginator', obj);
  }
}
export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}