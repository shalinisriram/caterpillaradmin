import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL; 
const apiURL = environment.apiURL;
const wrkInOp = environment.WorkInstructionInputOptionUrl;

@Injectable({
  providedIn: 'root'
})
export class WorkstationsService {

  constructor(private _httpClient:HttpClient) { }
  GetWorkStations(){
    return  this._httpClient.get( adminURL +'/WorkStations');
 }

 AddWorkStation(obj){
    return  this._httpClient.post( adminURL +'/WorkStations',obj);
 }
 deleteWorkStations(obj){
  return  this._httpClient.put( adminURL +'/WorkStations',obj);
}
UpdateWorkStation(id){
  return  this._httpClient.delete( adminURL +'/WorkStations/'+id);
}

getImageId(id)
{
  return this._httpClient.get<itemResponse>(wrkInOp+'SplInstruction/'+id)  
}

}
export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
