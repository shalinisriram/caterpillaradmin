import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;

@Injectable()
export class CatmodelService {

  constructor(private _httpClient: HttpClient) { }

  getModels() {
    return this._httpClient.get<itemResponse>(adminURL + '/CATModels');
  }

  addModel(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddCATModels', obj);
  }

  updateModel(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/EditCATModels', obj);
  }

  deleteModels(obj){

    return this._httpClient.post<itemResponse>(adminURL + '/DeleteCATModel',obj);
  }
  getSections(){
    return this._httpClient.get<itemResponse>(adminURL + '/GetSections');
  }

}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}