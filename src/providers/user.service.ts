import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { getgroups } from 'process';
const adminURL = environment.adminURL;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _httpClient: HttpClient) { }
  getUsers(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/FilterUsers',obj);
  }

  getgroups()
  {
    return this._httpClient.get<itemResponse>(adminURL + '/Groups'); 
  }

  addUser(obj) {
    console.log('Add User Service',obj);
    
    return this._httpClient.post<itemResponse>(adminURL + '/AddUsers', obj);
  }

  updateUser(obj) {
    console.log('Update User Service',obj);
    return this._httpClient.post<itemResponse>(adminURL + '/UpdateUser', obj);
  }

  deleteUsers(obj) {
    return this._httpClient.post<itemResponse>(adminURL + '/deleteUsers',obj);
  }

  getAreas(Section) {
    return this._httpClient.post<itemResponse>(adminURL + '/GetAreaWithSection' ,Section)
  }
  
  getSections(){
    return this._httpClient.get<itemResponse>(adminURL + '/GetSections');
  }
  
  ResetPassword(obj)
  {
    return this._httpClient.get<itemResponse>(adminURL +'/ResetPassWord?LoginId='+obj);
  }
}

export interface itemResponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}

