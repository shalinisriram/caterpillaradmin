import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;

@Injectable()
export class StationService {

  constructor(private _httpClient: HttpClient) { }
  
  getstations() {
    return this._httpClient.get<itemResponse>(adminURL + '/Stations');
  }

  addstations(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/AddStation', obj)
  }

  updateStation(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/UpdateStation', obj)
  }

  deletestation(Id) {
    return this._httpClient.get<itemResponse>(adminURL + '/DeleteStation?id='+Id);
  }

}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
