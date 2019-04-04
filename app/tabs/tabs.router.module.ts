import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core'
import { TabsPage } from './tabs.page';
const routes: Routes = [
	{
		path: '',
		component: TabsPage,
		children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './../home/home.module#HomePageModule'},
      { path: 'profile', loadChildren: './../profile/profile.module#ProfilePageModule'},
			{ path: 'chat/:key', loadChildren: './../chat/chat.module#ChatPageModule' },
			// { path: 'chat', loadChildren: './../chat/chat.module#ChatPageModule' },
		]
	}	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TabsRoutingModule { }
  