import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  constructor(private _router: Router){}
  public config: PerfectScrollbarConfigInterface = {};
  logout(){
    localStorage.removeItem('jwtToken');
    this._router.navigate(['loginpage'])
  }
  navigatSetting(){
    this._router.navigate(['settings'])
  }

  changePassword(){
    this._router.navigate(['/changepassword']);
  }

}
