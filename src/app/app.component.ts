import { Component } from '@angular/core';
import { AuthGuardService } from './auth/_services/auth-guard.service';
import { ModalButtonType, ModalService, GridModule } from 'carbon-components-angular';
import { LoginService } from './auth/_services/login.service';
import { Observable } from 'rxjs';

declare const jQuery: any;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	private authenticating: boolean;
	flag:boolean=false
	isLoggedIn : Observable<boolean>;

	constructor(
		private modalService : ModalService,
		private _loginService: LoginService
	) { 
		this.isLoggedIn = _loginService.isLoggedIn();
	}

	ngOnInit() {

	}

}
