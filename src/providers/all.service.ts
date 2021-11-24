import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { itemResponse } from './traceability.service';
const unitUrl = environment.unitUrl;
const uploadUrl = environment.uploadUrl;

@Injectable({
  providedIn: 'root'
})
export class AllService {

  constructor(private _httpClient:HttpClient) { }


  getAreaList(section) {
    let obj = {
      'areas':section

    }
    return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllAreasWithSection',obj);
  }

  getComponentList(area) {
    let obj ={
      'components':area,
      'models':["//"]
    }
    return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllComponentsWithAreas',obj);
  }

  getModelList(component) {
    let obj={
      'componentsToModel':component
    }
    return this._httpClient.post<itemResponse>(uploadUrl + 'GetAllCATModelsWithComponentss',obj);
  }
}
