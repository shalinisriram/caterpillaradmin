import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
const authUrl = environment.authUrl;
const adminURL  = environment.adminURL
@Injectable()
export class AuthService {

  constructor(private _httpClient: HttpClient) { }
   headerss = new HttpHeaders({
    "Content-Type": "application/xml",
    "X-EBAY-API-SITEID": "0",
    "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
    "X-EBAY-API-CALL-NAME": "GetMyeBayBuying",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "X-Requested-With, Origin, Content-Type, X-Auth-Token",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
    "Cache-Control": "no-cache"
  });

  // validate_user(currentUser) {

  //   console.log('validate_user',currentUser);
  //   return this._httpClient.post<itemresponse>(authUrl + '/AdminUser', currentUser,{headers:this.headerss});
  // }
  validate_user1(currentUser) {

    // console.log('validate_user',currentUser);
    return this._httpClient.post<itemresponse>(authUrl + '/AdminUser', currentUser);
    // return this._httpClient.get<itemresponse>(authUrl + '/connection');
  }

  validate_user() {

    // console.log('validate_user',currentUser);
     return this._httpClient.get<itemresponse>(authUrl + '/AdminUser');
    // return this._httpClient.get<itemresponse>(authUrl + '/connection');
  }

  connection()
  {
    return this._httpClient.get('https://localhost:5000/api/Admin')
  }

  register_user(currentUser) {
    this._httpClient.post('', currentUser);
  }

  loggedIn() {
    return !!localStorage.getItem('jwtToken');
  }

  getToken() {
    return localStorage.getItem('jwtToken');
  }

  changePassword(passObj){
    return this._httpClient.post<itemresponse>(adminURL + '/ChangePasswordUser', passObj);
  }
  loginds()
  {
    return this._httpClient.get<itemresponse>('http://schemas.cat.com/identity/claims/catloginid');

  }



}

export interface itemresponse {
  'status': '',
  'code': '',
  'message': '',
  'data': ''
}
