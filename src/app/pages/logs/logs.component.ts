import { Component, OnInit, Input } from '@angular/core';
import { ModalButtonType, ModalService } from 'carbon-components-angular';
import { Logs } from '../../_models/logs.model';
import { LogsService } from '../../_services/logs.service';
import { IUser } from '../../auth/_models/usuario.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

// Class that feeds Account Information screen
export class LogsComponent implements OnInit {
  @Input() currentUser: IUser = null;
  message:string = '';
  loading: boolean = false;
  parsedLogs = [];

  constructor(private _logsService:LogsService, private _modalService:ModalService) {
    this.getLogs(sessionStorage.getItem('uid'));
  }

  ngOnInit() {
  }

  getLogs(username:string) {
    this.loading = true;
    this._logsService.getLogs(username).subscribe(
      (value)=> 
      {
        value.reverse();
        value.slice(0,10).forEach((log) => {
          this.parsedLogs.push(this.parseLog(log));
        });
      },
      (err)=>{
        if(err)
			  {
				this.loading=false;
				if(err.statusText=='Uknown Error')
				{          this.message='The login request failed, please try again later'        }
				else {           this.message='Username or Password are incorrect'        }
			  }
      },
      ()=>{
        this.loading = false;
    });
  }

  parseLog(log: string) {
    let method,params,response;
    let time = log.slice(0,15);
    let restEndpoint = log.split('-').pop().trim().split('/').slice(1);
    let restTarget = restEndpoint[2];
    let info = log.split('gsa2rest')[1].trim().split('[')[1].split(']')[0];
    let requestUser = log.split('gsa2rest')[1].split(']')[1].trim().split(' ')[0]

    if (info === "INFO"){
      response = "SUCCESS"
    }
    else {
      response = "ERROR"
    }

    if (restEndpoint.length > 3){
      params = restEndpoint.slice(3);
    }
    else {
      params = 'None';
    }

    if (log.includes("GET")) {
      method = "GET"
    }
    else if (log.includes("POST")) {
      method = "POST"
    }

    let parsedLog;
    if (response !== "ERROR") {
      parsedLog = {
        fullLog: log,
        method: method,
        time: time,
        restTarget: '/' + restTarget,
        params: params,
        response: response,
        requestUser: requestUser
      }
    }
    else {
      parsedLog = {
        fullLog: log,
        method: null,
        time: time,
        restTarget: null,
        params: null,
        response: response,
        requestUser: requestUser
      }
    }
    return parsedLog;
  }
}