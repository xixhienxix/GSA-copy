import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { IUser } from '../_models/usuario.model';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserSubject$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(undefined);
  _hasError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  _islogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());


  constructor(private http: HttpClient) { }

  get getUserLogin() {
    return this._islogin$.value
  }

  getCurrentUserinfo(): BehaviorSubject<IUser> {
    return this.currentUserSubject$;
  }

  getLoginStatus(): BehaviorSubject<boolean> {
    return this._islogin$;
  }

  get getcurrentUserSubject(){
    return this.currentUserSubject$.value
  }

  login(username: string, password?: string): Observable<IUser> {
    const basicAuth = username + ':' + password;

    //url=https://edlab/api/v1/accounts
    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));

    return this.http.get(environment.apiUrl + "accounts/" + username, { headers: Headers })
      .pipe(catchError(err => {
        if (err) {

          this._hasError$.next(true)
          return throwError(err.message)
        }
      }), map((currentUser: any) => {
        let user: IUser;

        sessionStorage.setItem('uid',currentUser.uid);
				sessionStorage.setItem('displayName',currentUser.displayname);
				sessionStorage.setItem('departmentNumber',currentUser.departmentnumber);
				sessionStorage.setItem('uidnumber',currentUser.uidnumber.toString());
				sessionStorage.setItem('pass',password);

        this.isLoginSubject.next(true);
				this.currentUserSubject$.next(currentUser)

        user = currentUser
        //  this.currentUserSubject$.next(usuario);
        this.currentUserSubject$ = new BehaviorSubject<IUser>(user);

        return user


      }))
  }

  logout() : void {
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('displayName');
		sessionStorage.removeItem('departmentNumber');
		sessionStorage.removeItem('uidnumber');
		sessionStorage.removeItem('pass');
    this.isLoginSubject.next(false);
  }

  //Will change for real token after jwt gets implemented on backend
  private hasToken() : boolean {
    return !!sessionStorage.getItem('uid');
  }

  getUser(username: string): Observable<IUser> {

    const basicAuth = sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass');

    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));

    return this.http.get(environment.apiUrl + "accounts/" + username, { headers: Headers })
      .pipe(catchError(err => {
        if (err) {

          this._hasError$.next(true)
          return throwError(err.message)
        }
      }), map((datosUsuario: any) => {
        let usuario: IUser;
        this.isLoginSubject.next(true)
        usuario = datosUsuario
        //  this.currentUserSubject$.next(usuario);
        this.currentUserSubject$ = new BehaviorSubject<IUser>(usuario);

        return usuario


      }))
  }

  isLoggedIn() : Observable<boolean> {
    return this.isLoginSubject.asObservable();
   }

}
