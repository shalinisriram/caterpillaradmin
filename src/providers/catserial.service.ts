import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;

@Injectable({
  providedIn: 'root'
})
export class CatserialService {

  constructor(private _httpClient:HttpClient) { }
  GetCatSerial(){
    return  this._httpClient.get( adminURL +'/CATSerials');
 }

 AddCATSerial(obj){
    return  this._httpClient.post( adminURL +'/CATSerials',obj);
 }
 updateCatserial(obj){
  return  this._httpClient.put( adminURL +'/CATSerials',obj);
}
deleteCatserial(id){
  return  this._httpClient.delete( adminURL +'/CATSerials/'+id);
}

}
