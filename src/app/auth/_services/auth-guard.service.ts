import { Injectable, Input } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';
import { ModalButtonType, ModalService } from 'carbon-components-angular';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public _loginService: LoginService, 
    public router: Router, protected modalService: ModalService) { }

  private authenticated = new BehaviorSubject<boolean>(false);
  private authenticating = new BehaviorSubject<boolean>(false);


  canActivate(): boolean {
    if (this._loginService._islogin$.value===true || sessionStorage.getItem('uidnumber')) {
        return true    
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }
  
}