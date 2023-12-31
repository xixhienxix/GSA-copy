import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StarterHomeComponent } from './starter-home/starter-home.component';
import {
	GridModule,
	ListModule,
	TabsModule,
	TilesModule
} from 'carbon-components-angular';
import { StarterHomeRoutingModule } from './starter-home-routing.module';
import { AsideDynamicComponent } from '../asidebar/asidebar-dynamic/asidebar-dynamic.component';

@NgModule({
	imports: [
		CommonModule,
		StarterHomeRoutingModule,
		GridModule,
		ListModule,
		TabsModule,
		TilesModule,
	],
	declarations: [StarterHomeComponent]
})
export class StarterHomeModule { }
