import { Component,Input, Inject  } from "@angular/core";
import { BaseModal, ModalButtonType, ModalService } from "carbon-components-angular/modal";



@Component({
	selector: "app-form-modal",
	template: `
    <ibm-modal
          [size]="size"
          [open]="open"
          (overlaySelected)="closeModal()">
          <ibm-modal-header (closeSelect)="closeModal()" [showCloseButton]="showCloseButton">
            <h2 ibmModalHeaderLabel>Label</h2>
            <h3 ibmModalHeaderHeading>Modal</h3>
          </ibm-modal-header>
          <section ibmModalContent>
            <h1>Sample modal works.</h1>
            <p ibmModalContentText>{{modalText}}</p>
          </section>
          <ibm-modal-footer>
            <button cdsButton class="bx--btn bx--btn--secondary" (click)="showSecondaryModal()">Show secondary modal</button>
            <button cdsButton class="bx--btn bx--btn--primary" modal-primary-focus (click)="closeModal()">Close</button>
          </ibm-modal-footer>
        </ibm-modal>
	`,
	styles: [`
		.modal-text {
			margin-bottom: 30px;
		}
	`]
})
export class FormModalComponent extends BaseModal { 

	constructor(
		@Inject("modalText") public modalText,
		@Inject("size") public size,
		@Inject("showCloseButton") public showCloseButton = true,
		protected modalService: ModalService) {
		super();
	}


	showSecondaryModal() {



		// this.modalService.show({
		// 	label: "Secondary header label",
		// 	title: "Sample secondary modal works.",
		// 	content: this.modalText,
		// 	size: this.size,
		// 	buttons: [{
		// 		text: "Cancel",
		// 		type: ModalButtonType.secondary
		// 	}, {
		// 		text: "OK",
		// 		type: ModalButtonType.primary,
		// 		click: () => alert("OK button clicked")
		// 	}]
		// });
	}
}


