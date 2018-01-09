import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// components
import { SearchBarComponent } from './components/search-bar';
import { SearchPageComponent } from './pages/search-page';

// modules
import { SharedModule } from '../shared';
import { TracklistsModule } from '../tracklists';

// services
import { SearchService } from './search-service';

// routes
const routes: Routes = [
  {path: 'search', component: SearchPageComponent}
];


@NgModule({
  declarations: [
    SearchBarComponent,
    SearchPageComponent
  ],
  exports: [
    SearchBarComponent
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TracklistsModule
  ],
  providers: [
    SearchService
  ]
})
export class SearchModule {}
