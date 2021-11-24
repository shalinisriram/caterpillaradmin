import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const unitUrl = environment.unitUrl;
const uploadUrl = environment.uploadUrl;
@Injectable()
export class TraceabilityService {

  constructor(private _httpClient: HttpClient) { }

  getTraceability(obj) {
    return this._httpClient.post<itemResponse>(unitUrl + 'Trace/TracebilityS', obj);
  }

  deleteItems() {
    return this._httpClient.get<itemResponse>(unitUrl + 'Trace/LineLoadNumbers')
  }
  
  getSectionList() {
    return this._httpClient.get<itemResponse>(uploadUrl + 'AllSection');
  }

  getAreaLists(section) {
    return this._httpClient.get<itemResponse>(uploadUrl + 'GetAllAreaWithSection?section='+section);
  }

  getAreaList(section) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllAreasWithSection',section);
  }
  getComponentLists(area) {
    return this._httpClient.get<itemResponse>(uploadUrl + 'GetAllComponentsWithArea?area='+area);
  }
  getComponentList(area) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllComponentsWithAreas',area);
  }

  getModelList(component) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllCATModelsWithComponentss',component);
  }
  getModelLists(component) {
    return this._httpClient.get<itemResponse>(uploadUrl + 'GetAllCATModelsWithComponent?component='+component);
  }

  getLineLoadNumbers(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllLineLoadNumberS',obj)
  }

}
export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}