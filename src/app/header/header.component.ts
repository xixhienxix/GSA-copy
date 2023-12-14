import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { BaseModal, Dropdown, ModalButtonType, ModalService } from 'carbon-components-angular';
import { AuthGuardService } from '../auth/_services/auth-guard.service';
import { InputModaComponent } from '../modals/input-modal/input-modal.component';
import { Observable, Subject } from 'rxjs';
import { LoginService } from '../auth/_services/login.service';
import { LoginComponent } from '../auth/login/login.component';
import { environment } from '../../environments/environment';
import { IUser } from '../auth/_models/usuario.model';
import { distinctUntilChanged } from 'rxjs/operators';
const userDefaultValues:IUser = {
	cn: '',
    departmentnumber: '',
    displayname: '',
    dn: '',
    gecos: '',
    gidnumber: 1,
    givenname: '',
    has_keytab: false,
    has_password: false,
    homedirectory: '',
    initials: '',
    ipauniqueid: '',
    ipauserauthtype: '',
    krbcanonicalname: '',
    krblastpwdchange: {
      __datetime__: ''
    },
    krbpasswordexpiration: {
      __datetime__: ''
    },
    krbprincipalname: '',
    loginshell: '',
    mail: '',
    managerof_group: [],
    memberof_group: [],
    nsaccountlock: false,
    preserved: false,
    sn: '',
    uid: '',
    uidnumber: 1,
    users_owned: [],
    ou: ''
}
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseModal implements OnInit{
	// adds padding to the top of the document, so the content is below the header
	message:string
	@Input() size = "md";
	loading:boolean=false;
	loggedInUserName: string = localStorage.getItem('uid');
	loggedInUserId: string = localStorage.getItem('displayName');
	loggedInDepartmentNumber: string = localStorage.getItem('departmentNumber');
	currentUser:IUser=userDefaultValues



	protected modalInputValue = "";
	protected data: Observable<string> = new Subject<string>();

	constructor(protected modalService: ModalService, public _loginService:LoginService) {
		super();

		if(this._loginService.getcurrentUserSubject){
			this.currentUser = this._loginService.getcurrentUserSubject;
		}

	}
	ngOnInit(): void {
		this._loginService.getCurrentUserinfo().pipe(distinctUntilChanged()).subscribe(
            (user: IUser) => {
                this.currentUser = user;
            }
        );
	}

	logout(){
		this._loginService.logout();
	}


}
