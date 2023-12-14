import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Logs } from '../_models/logs.model';
import { IUser } from '../auth/_models/usuario.model';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  
  
  _hasError$:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false)

  constructor(private http:HttpClient) { }
  
  getLogs(username:string) :Observable<any> {
    const url = environment.logsUrl;
    console.log(url);
    
    var headers_object = new HttpHeaders();

    headers_object.append("Authorization", "Basic " + btoa(sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass')));

    
    const httpOptions = {
      headers: headers_object
    };
    const basicAuth = sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass');
    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));
    return this.http.get(url,{ headers: Headers })
    .pipe(catchError(err => 
      {
      if(err){
        this._hasError$.next(true)
        return throwError(err.message)
      }
    }),map((logsObj:any)=>{
      return logsObj;
    }))
}

}
