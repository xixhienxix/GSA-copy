import { Component, Inject, OnInit } from "@angular/core";
import { ModalService, BaseModal } from "../../../../node_modules/carbon-components-angular/modal";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
	selector: "app-input-modal",
	templateUrl:"./input-modal.component.html",
	styleUrls: ['./input-modal.component.scss']
})
export class InputModaComponent extends BaseModal implements OnInit {
	form: FormGroup;
	message:string;

	constructor(
		@Inject("modalText") public modalText,
		@Inject("size") public size,
		@Inject("data") public data,
		@Inject("inputValue") public inputValue,
		protected modalService: ModalService) {
		super();
		
	}

	ngOnInit(){
		this.initForm();
	}

	initForm() {
		this.form = new FormGroup({
		  username: new FormControl()
		});
	}

	submit(){
		/* this.loginService.login(this.form.controls['username'].value).subscribe(
			(value)=> 
			{
				console.log(value)
			},
			(err)=>{
			  if(err)
			  {
				if(err.statusText=='Uknown Error')
				{          this.message='Fallo en la solicitud intente de nuevo mas tarde'        }
				else {           this.message='Usuario o Contraseña Incorrectos'        }
			  }
			},
			()=>{
			  console.log('finalize')
			}) */
	}

	onChange(event) {
		this.data.next(event.target.value);
	}
}
