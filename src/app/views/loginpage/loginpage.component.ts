import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  AuthorizationEndpoint ='https://fedloginqa.cat.com/as/authorization.oauth2'
  ClientId ='VisualWork_ac_client'
  ClientSecret ='D3Lj2Du6054G61kP01efBaKk1MBwfw2FP163MnrddOh1X6FcH3Y1ZKNWYr0TOKW0'
  redirectUrl ='https://caterpillarwi-admin.azurewebsites.net/login'

  constructor() { }

  ngOnInit() {
    this.cws()
  }

  cws()
  {
    //  window.location.replace(this.AuthorizationEndpoint+'?client_id='+this.ClientId+'&pfidpadapterid=OAuthAdapterBasicIdentity&response_type=code&grant_type=authorization_code&scope=manage:all&state=12345&redirect_uri='+this.redirectUrl+'&client_secretkey='+this.ClientSecret+'&client_id='+this.ClientId);
     window.location.replace('https://localhost:5000/api/auth/connection');
  }

}
