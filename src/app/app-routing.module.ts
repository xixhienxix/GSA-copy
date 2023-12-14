import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { DocsComponent } from './pages/docs/docs.component';
import { SupportComponent } from './pages/support/support.component';
import { Link1Component } from './pages/link1/link1.component';
import { AuthGuardService as AuthGuard } from './auth/_services/auth-guard.service';
import { LoginComponent } from './auth/login/login.component';
import { AccountInfoComponent } from './pages/account-info/account-info.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ManageGroupsComponent } from './pages/manage-groups/manage-groups.component';

const routes: Routes = [
	// {
	// 	path: 'auth',
	// 	loadChildren: () =>
	// 	import('./auth/auth.module').then((m) => m.AuthModule),
	// },
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'account',
		component: AccountInfoComponent,
		canActivate:[AuthGuard]
	},
	{
		path: 'logs',
		component: LogsComponent
	},
	{
		path: 'manage-projects',
		component: ProjectsComponent
	},	
	{
		path: 'manage-groups',
		component: ManageGroupsComponent
	} 
	,{ path: '**',   
	redirectTo: 'login' 
  },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
