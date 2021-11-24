import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;
@Injectable()
export class ComponentService {

  constructor(private _httpClient: HttpClient) { }
  getcomponent() {
    return this._httpClient.get<itemResponse>(adminURL + '/GetComponent');
  }

  addComponent(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddComponent', obj);
  }

  updateComponent(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/UpdateComponent', obj);
  }

  deleteComponent(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/UpdateComponent', obj);
  }

  deleteComponents(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/DeleteComponent',obj);
  }
  getModels(){
    return this._httpClient.get<itemResponse>(adminURL + '/GetCATModelSelection');
  }

  getareas(){
    return this._httpClient.get<itemResponse>(adminURL +'/GetAreaSelection');
  }
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
