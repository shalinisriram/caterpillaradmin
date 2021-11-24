import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../providers/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  passwordObj: any = {
    'userName': '',
    'oldPassword': '',
    'newPassword': '',
    'cfnewPassword' :''
  }
  currentUser;
  constructor(private _authService: AuthService,
    private toastr: ToastrService,
    private _router: Router, ) {
    this.currentUser = localStorage.getItem('currentUser');
  }

  ngOnInit() {
  }

  changePassword() {
    if (this.passwordObj.oldPassword === this.passwordObj.newPassword) {
      this.toastr.error('Old Password and New Password are same', 'Error');
    }
    else if (this.passwordObj.newPassword !== this.passwordObj.cfnewPassword) {
      this.toastr.error(' Password and confirm Password are not matched', 'Error');
    } else {
      let obj = {
        'UserName': this.currentUser,
        'Password': this.passwordObj.oldPassword,
        'NewPassword': this.passwordObj.newPassword
      }
      this._authService.changePassword(obj).subscribe(
        (response) => {
          const result = response;
          if (result.code) {
            this.toastr.success(result.message, 'Success');
            this._router.navigate(['traceability']);
          } else {
            this.toastr.error(result.message, 'Error');
          }
        },
        (error) => {
          console.log('changePassword()', error);
        }
      );
    }

  }

}
