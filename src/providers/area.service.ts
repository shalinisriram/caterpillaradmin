import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";
const uploadUrl = environment.uploadUrl;

@Injectable()
export class AreaService {

  constructor(private _httpClient: HttpClient) { }
  
  getAreas() {
    return this._httpClient.get<itemResponse>(uploadUrl + 'Area');
  }

  addArea(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'AddArea', obj)
  }

  updateArea(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'EditArea', obj)
  }

  getPermission()
    {
      return this._httpClient.get<itemResponse>(uploadUrl + 'PermissionList');
    }
  

  deleteArea(Id) {
    return this._httpClient.delete<itemResponse>(uploadUrl + 'DeleteArea?id='+Id);
  }

  getPlants(){
    return this._httpClient.get<itemResponse>(uploadUrl + 'PlantList');
  }

  getSections(){
    return this._httpClient.get<itemResponse>(uploadUrl + 'AllSection');
  }

  deleteAreas(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'DeleteArea',obj);
  }
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
