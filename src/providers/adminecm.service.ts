import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
const adminecmURL = environment.adminecmURL;
@Injectable({
  providedIn: 'root'
})
export class AdminecmService {

  constructor(private _httpClient: HttpClient) { }

  getProcess()
  {
    return this._httpClient.get<itemResponse>(adminecmURL + '/ProcessList');
  }

  deleteUnits(obj){
    return this._httpClient.post<itemResponse>(adminecmURL + '/DeleteProcess',obj);
  }

  addProcess(obj)
  {
    return this._httpClient.post<itemResponse>(adminecmURL + '/AddProcess', obj)
  }

  editProcess(obj)
  {
    return this._httpClient.post<itemResponse>(adminecmURL + '/EditProcess', obj)
  }

  getCheckList()
  {
    return this._httpClient.get<itemResponse>(adminecmURL + '/GetCheckList');
  }

  deleteCheckList(obj){
    return this._httpClient.post<itemResponse>(adminecmURL + '/DeleteCheckList',obj);
  }

  addCheckList(obj)
  {
    return this._httpClient.post<itemResponse>(adminecmURL + '/AddCheckLits', obj)
  }

  editCheckList(obj)
  {
    return this._httpClient.post<itemResponse>(adminecmURL + '/EditCheckList', obj)
  }
  getDepartment()
  {
    return this._httpClient.get<itemResponse>(adminecmURL + '/DepartmentList');
  }

  deleteDepartment(obj){
    return this._httpClient.post<itemResponse>(adminecmURL + '/DeleteDepartment',obj);
  }

  addDepartment(obj)
  {
    return this._httpClient.post<itemResponse>(adminecmURL + '/AddDepartments', obj)
  }

  editDepartment(obj)
  {
    return this._httpClient.post<itemResponse>(adminecmURL + '/EditDepartments', obj)
  }
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
