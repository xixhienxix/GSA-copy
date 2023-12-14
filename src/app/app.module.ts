import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// carbon-components-angular default imports
import { StructuredListModule, DropdownModule, IconModule, IconService, Label, PlaceholderModule, UIShellModule, GridModule, AccordionModule, TableModule, ButtonModule, SearchModule, I18nModule, DialogModule, InputModule } from 'carbon-components-angular';
import Notification20 from '@carbon/icons/es/notification/16';
import UserAvatar20 from '@carbon/icons/es/user--avatar/16';

import { HeaderComponent } from './header/header.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { DocsComponent } from './pages/docs/docs.component';
import { SupportComponent } from './pages/support/support.component';
import { Link1Component } from './pages/link1/link1.component';
import { AsideDynamicComponent } from './asidebar/asidebar-dynamic/asidebar-dynamic.component';
import { ModalModule } from 'carbon-components-angular';
import { AuthGuardService as AuthGuard } from './auth/_services/auth-guard.service';
import { LoginComponent } from './auth/login/login.component';
import { InputModaComponent } from './modals/input-modal/input-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { FormModalComponent } from './pages/form-modal/form-modal.component';
import { SpinnerComponent } from './_helpers/spinner/spinner.component';
import { AccountInfoComponent } from './pages/account-info/account-info.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ManageGroupsComponent } from './pages/manage-groups/manage-groups.component';
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		CatalogComponent,
		DocsComponent,
		SupportComponent,
		Link1Component,
		AsideDynamicComponent,
		InputModaComponent,
		FormModalComponent,
		SpinnerComponent,
		AccountInfoComponent,
		LogsComponent,
		ProjectsComponent,
		LoginComponent,
		ManageGroupsComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		AppRoutingModule,
		UIShellModule,
		IconModule,
		ModalModule,
		IconModule,
		PlaceholderModule,
		ReactiveFormsModule,
		HttpClientModule,
		StructuredListModule,
		GridModule,
		DropdownModule,
		AccordionModule,
		ButtonModule,
		SearchModule,
		I18nModule,
		IconModule,
		TableModule,
		DialogModule,
		InputModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(protected iconService: IconService) {
		iconService.registerAll([
			Notification20,
			UserAvatar20,
		]);
	}
}