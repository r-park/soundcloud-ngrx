import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { HomePageComponent } from './pages/home-page';

// modules
import { SharedModule } from 'src/shared';
import { TracklistsModule } from 'src/tracklists';

// routes
const routes: Routes = [
  {path: '', component: HomePageComponent}
];


@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    TracklistsModule
  ]
})
export class HomeModule {}
