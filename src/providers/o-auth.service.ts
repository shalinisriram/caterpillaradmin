import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {

  AuthorizationEndpoint ='https://fedloginqa.cat.com/as/authorization.oauth2'
  ClientId ='VisualWork_ac_client'
  ClientSecret ='D3Lj2Du6054G61kP01efBaKk1MBwfw2FP163MnrddOh1X6FcH3Y1ZKNWYr0TOKW0'
  redirectUrl ='https://caterpillarwi-admin.azurewebsites.net/login'



  constructor(private _http:HttpClient) { }

  routeoauth()
  {
    this._http.get(this.AuthorizationEndpoint+'?client_id='+this.ClientId+'&pfidpadapterid=OAuthAdapterBasicIdentity&response_type=code&grant_type=authorization_code&scope=manage:all&state=12345&redirect_uri='+this.redirectUrl+'&client_secretkey='+this.ClientSecret+'&client_id='+this.ClientId)
  }
}
