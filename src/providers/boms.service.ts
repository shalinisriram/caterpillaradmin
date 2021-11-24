import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;

@Injectable()
export class BOMsService {

  constructor(private _httpClient:HttpClient) { }
  getBOMs(){
    return  this._httpClient.get( adminURL +'/BOMs');
  }

 addBOMs(obj){
    return  this._httpClient.post( adminURL +'/BOMs',obj);
 }
 UpdateBOM(obj){
  return  this._httpClient.put( adminURL +'/BOMs',obj);
}
deleteBOMs(id){
  return  this._httpClient.delete( adminURL +'/BOMs/'+id);
}
}
