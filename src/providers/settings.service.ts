import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;

@Injectable()
export class SettingsService {

  constructor(private _httpClient: HttpClient) { }
  getSettings() {
    return this._httpClient.get<itemResponse>(adminURL + '/AdminSettings');
  }
  addSettings(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddSettings', obj);
  }
  updateSettings(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/EditSettings', obj);
  }
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}

