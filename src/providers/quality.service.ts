import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../environments/environment';
const wrkInOp = environment.WorkInstructionInputOptionUrl
@Injectable({
  providedIn: 'root'
})
export class QualityService {

  constructor(private _http:HttpClient) { }
  getAlltasks(){
    return this._http.get<any[]>(wrkInOp+'UserWorkStation?userName=divya');
   
  }
}
