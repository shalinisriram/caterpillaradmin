
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private _router: Router, private _authService: AuthService) { }
    canActivate(): boolean {
        if (this._authService.loggedIn()) {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}