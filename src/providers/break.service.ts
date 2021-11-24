import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

const uploadUrl = environment.uploadUrl;

@Injectable()
export class BreakService {
  constructor(private _httpClient: HttpClient) { }

  getBreaks() {
    return this._httpClient.get<itemResponse>(uploadUrl + 'Breaks');
  }

  addBreak(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'AddBreaks', obj)
  }

  updateBreak(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'EditBreaks', obj)
  }

  deleteBreak(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'DeleteBreaks',obj);
  }

  deleteBreaks(obj) {
    return this._httpClient.post<itemResponse>(uploadUrl + 'DeleteMultipleBreaks',obj);
  }

}

export interface itemResponse {
  code: '',
  data: any,
  message: '',
  status: ''
}


