import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../providers/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  currentUser: any = {}
  AuthUrl:string;
  loginTo:string;
  Permissions:any=[];
  constructor(private fb: FormBuilder, private toasterService: ToastrService,
    private _router: Router, private _authservice: AuthService) { }
  roles: any = ['User', 'QualityAuditor', 'operator']
  ngOnInit() {

    // this.form = this.fb.group({
    //   UserName: [null, Validators.compose([Validators.required])],
    //   // Password: [null, Validators.compose([Validators.required])],
    // });
    this.onSubmit1()
  }
  cws()
  {
    window.open('https://localhost:5000/api/Admin')
  }
  onSubmit() {
    this.currentUser['UserName'] = this.form.value.UserName
    this.currentUser['Password'] = '123',
      this._authservice.validate_user1(this.currentUser).subscribe(
        (response) => {
          console.log('Login Result',response);
          const result = response;
          if (result.code) {
            if (localStorage.length > 0 ) {
              localStorage.clear();
            }
            localStorage.setItem('jwtToken', result.data['Token']);
            localStorage.setItem('currentUser', result.data['UserName']);
            localStorage.setItem('RoleType', result.data['RoleType']);
            localStorage.setItem('Permissions',result.data['Permissions']);
            localStorage.setItem('Process',JSON.stringify(result.data['Process']));

            this.toasterService.success("Login Successful", "Success");
            this.Permissions = localStorage.getItem('Permissions');

              if(this.Permissions.includes("Operations") || this.Permissions.includes("AdminOperations"))
              {
                this._router.navigate(['traceability']);
              }
             else if(this.Permissions.includes("Ecm") || this.Permissions.includes("AdminEcm"))
              {
                this._router.navigate(['inbox']);
              }
              else{
                this._router.navigate(['inbox']);
              }

          } else {
            this.toasterService.error("Login Failed", "Error");

          }
        },
        (error) => {
          console.log('onSubmit()', error)
        }
      );
  }
  onSubmit1() {
    this.currentUser['UserName'] = "shalini"
    this.currentUser['Password'] = '123',

      this._authservice.validate_user().subscribe(
        (response) => {
          console.log('Login Result',response);
          const result = response;
          if (result.code) {
            if (localStorage.length > 0 ) {
              localStorage.clear();
            }
            localStorage.setItem('jwtToken', result.data['Token']);
            localStorage.setItem('currentUser', result.data['UserName']);
            localStorage.setItem('RoleType', result.data['RoleType']);
            localStorage.setItem('Permissions',result.data['Permissions']);
            localStorage.setItem('Process',JSON.stringify(result.data['Process']));

             this.toasterService.success("Login Successful", "Success");
            this.Permissions = localStorage.getItem('Permissions');

              if(this.Permissions.includes("Operations") || this.Permissions.includes("AdminOperations"))
              {

                this._router.navigate(['traceability']);
              }
             else if(this.Permissions.includes("Ecm") || this.Permissions.includes("AdminEcm"))
              {
                this._router.navigate(['inbox']);
              }
              else{
                this._router.navigate(['inbox']);
              }

          } else {
            this.toasterService.error("Login Failed", "Error");

          }
        },
        (error) => {
          console.log('onSubmit()', error)
        }
      );
  }


}
