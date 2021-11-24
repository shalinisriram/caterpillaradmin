import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
const adminURL = environment.adminURL;

@Injectable({
  providedIn: 'root'
})
export class WorkinstructionService {

  constructor(private _httpClient: HttpClient) { }
  GetWorkInstructions() {
    return this._httpClient.get(adminURL + '/WorkInstructions');
  }

  AddWorkInstruction(obj) {
    return this._httpClient.post(adminURL + '/WorkInstructions', obj);
  }
  deleteWorkInstructions(obj) {
    return this._httpClient.put(adminURL + '/WorkInstructions', obj);
  }

  UpdateWorkInstruction(id) {
    return this._httpClient.delete(adminURL + '/WorkInstructions/' + id);
  }
}
