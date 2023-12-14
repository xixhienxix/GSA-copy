import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseModal, ModalButtonType, ModalService } from 'carbon-components-angular';
import { LoginService } from '../_services/login.service';
import { Router } from '@angular/router';

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ['login.component.scss'],
})
export class LoginComponent extends BaseModal implements OnInit {
	closeResult: string;
	loginForm: FormGroup;
	loading: boolean = false
	message: string = "";

	constructor(
		protected modalService: ModalService,
		private fb: FormBuilder,
		private _loginService: LoginService,
		private router:Router
	) {
		super();
		sessionStorage.clear();
	}

	get getlogin() {
		return this.loginForm.controls;
	  }

	ngOnInit() {
		console.log('logincomponent')
		this.loginForm = this.fb.group({
			username: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(20),
				]),
			],
			password: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(15),
				]),
			],
		});
	}


	showSecondaryModal() {
		this.modalService.show({
			label: "Secondary header label",
			title: "Sample secondary modal works.",
			content: 'content',
			size: 'xs',
			buttons: [{
				text: "Cancel",
				type: ModalButtonType.secondary
			}, {
				text: "OK",
				type: ModalButtonType.primary,
				click: () => alert("OK button clicked")
			}]
		});
	}

	submitLogin() {
		this.loading = true
		const usuario = this.getlogin.username.value;
		const password = this.getlogin.password.value;
		this._loginService.login(usuario,password).subscribe(
			(value) => {
				this.loading = false
				this.router.navigate(['/account']);
			},
			(err) => {
				if (err) {
					if (err.statusText == 'Uknown Error') { this.message = 'The login request failed, please try again later' }
					else { this.message = 'Username or Password are incorrect' }
					this.modalService.show({
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
				this.loading = false

			},
			() => {
				this.loading = false
			})
	}
}
