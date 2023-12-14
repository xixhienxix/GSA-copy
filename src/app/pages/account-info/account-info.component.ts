import { Component, OnInit, Input } from '@angular/core';
import { StructuredList, DropdownList, Dropdown, ModalButtonType, ModalService } from 'carbon-components-angular';
import { IUser } from '../../auth/_models/usuario.model';
import { LoginService } from '../../auth/_services/login.service';
import { environment } from '../../../environments/environment';
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
  selector: 'account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})

// Class that feeds Account Information screen
export class AccountInfoComponent implements OnInit {
  @Input() currentUser: IUser = userDefaultValues;
  ownedUsers = [];
  message:string = '';
  loading: boolean = false;


  constructor(private _loginService:LoginService, private _modalService:ModalService) {
    // will change this to "this.getOwnedUsers" and feed username from IUser input
      if(this._loginService.getcurrentUserSubject){
        this.currentUser = this._loginService.getcurrentUserSubject;
      }
  }

  ngOnInit() {
		this.getOwnedUsers(this.currentUser);
  }

  // gets user info
  getUser(username: string, fetchOwnedUsers: boolean = false) {
    this.loading = true;
    this._loginService.getUser(username).subscribe(
      (value)=>
      {
        this.currentUser = value;
        if (fetchOwnedUsers){
          this.getOwnedUsers(value);
        }
      },
      (err)=>{
        if(err)
			  {
				this.loading=false
				if(err.statusText=='Uknown Error')
				{          this.message='The login request failed, please try again later'        }
				else {           this.message='Username or Password are incorrect'        }
				this._modalService.show({
					title: "Error on Loading Attempt",
					content: this.message,
					size: "xs",
					buttons: [{
						text: "Cancel",
						type: ModalButtonType.secondary
					}, {
						text: "OK",
						type: ModalButtonType.primary,
					}]
				})
			  }
      },
      ()=>{
        this.loading = false;
    });
  }

  //populates dropdown with current users "owned_users"
  getOwnedUsers(value: IUser){
    value.users_owned.forEach((user) => {
      let selected = false;
      if (user === value.uid){
        selected = !selected;
      }
      this.ownedUsers.push({
        content: user,
        selected: selected
      });
    });
    this.loading=false
  }

  //updates currentUser with selected user
  onSelect(event: Event){
    this.getUser(event["item"]["content"]);
  }


}
