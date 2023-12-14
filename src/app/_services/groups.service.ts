import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Project, AddProjectResponse, DeleteProjectResponse } from '../_models/project.model';
import { IGroup } from '../_models/groups.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  
  groupList$:BehaviorSubject<IGroup> = new BehaviorSubject<IGroup>(undefined)
  _hasError$:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false)

  constructor(private http:HttpClient) { }
  
  getGroups() : Observable<IGroup> {
    const url = environment.groupsUrl;
    
    const basicAuth = sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass');

    //url=https://edlab/api/v1/groups
    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));

    return this.http.get(url,{ headers: Headers })
    .pipe(catchError(err => 
      {
      if(err){
        this._hasError$.next(true)
        return throwError(err.message)
      }
    }),map((groups: IGroup)=>{


      this.groupList$.next(groups)
        return groups
    }))
  }



  addGroup(newgroupName:string) : Observable<any> {
    const url = environment.groupsUrl;
    console.log(url);
    
    var headers_object = new HttpHeaders();
    const basicAuth = sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass');
    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));
    Headers = Headers.append('Content-Type', 'application/json');


    return this.http.post(url,{ project_name : newgroupName, suffix : 'test' },{ headers: Headers } )
    .pipe(catchError(err => 
      {
      if(err){
        this._hasError$.next(true)
        return throwError(err.message)
      }
    }),map((projectResponse: AddProjectResponse)=>{
      return projectResponse;
    }))
  }


  deleteGroup(username:string,groupname:string) : Observable<any> {
    const url = environment.groupsUrl + `/${groupname}`;
    
    var headers_object = new HttpHeaders();
    const basicAuth = sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass');
    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));
    Headers = Headers.append('Content-Type', 'application/json');


    return this.http.delete(url, { headers: Headers } )
    .pipe(catchError(err => 
      {
      if(err){
        this._hasError$.next(true)
        return throwError(err.message)
      }
    }),map((projectResponse: DeleteProjectResponse)=>{
      return projectResponse;
    }))
  }
  
}
