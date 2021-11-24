import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";
const archiveUrl = environment.archiveUrl;

@Injectable()
export class  ArchiveService {

  constructor(private _httpClient: HttpClient) { }

  getArchivedUnits(){
    return this._httpClient.get<itemResponse>(archiveUrl + 'ArchivedUnits');
  }
  
  archiveUnitData(obj){
    return this._httpClient.post<itemResponse>(archiveUrl + 'Archive',obj);
  }

  archiveUnitDataDetails(obj){
    return this._httpClient.post<itemResponse>(archiveUrl + 'ArchivedItems',obj);
  }

}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
