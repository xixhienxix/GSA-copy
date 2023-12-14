import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Project, AddProjectResponse, DeleteProjectResponse } from '../_models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  
  
  _hasError$:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false)

  constructor(private http:HttpClient) { }
  
  getProjects(username:string) : Observable<Project[]> {
    const url = environment.projectsUrl;
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
    }),map((projects: Project[])=>{
      let projectsArray: Project[];
      projectsArray = projects;
      return projectsArray;
    }))
  }

  getQuota(username:string, projectName:string) : Observable<any> {
    const url = environment.projectsUrl + '/' + projectName + '/quota';
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
    }),map((quotas: any)=>{
      let quota = quotas["quotas"][0]["blockQuota"];
      return quota;
    }))
  }

  addProject(username:string, projectName: string) : Observable<any> {
    const url = environment.projectsUrl;
    console.log(url);
    
    var headers_object = new HttpHeaders();
    const basicAuth = sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass');
    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));
    Headers = Headers.append('Content-Type', 'application/json');

    return this.http.post(url,{ project_name: projectName },{ headers: Headers } )
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

  deleteProject(username:string, projectName: string) : Observable<any> {
    const url = environment.projectsUrl + `/${projectName}`;
    console.log(url);
    
    var headers_object = new HttpHeaders();
    const basicAuth = sessionStorage.getItem('uid') + ':' + sessionStorage.getItem('pass');
    let Headers = new HttpHeaders();
    Headers = Headers.append('Authorization', 'Basic ' + btoa(basicAuth));

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
