import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// components
import { AppComponent } from './app';
import { AppHeaderComponent } from './app-header';
import './rxjs-operators';

// modules
import { CoreModule } from './core';
import { HomeModule } from './home';
import { PlayerModule } from './player';
import { SearchModule } from './search';
import { SharedModule } from './shared';
import { TracklistsModule } from './tracklists';
import { UsersModule } from './users';


@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], {useHash: false}),
    CoreModule,
    HomeModule,
    PlayerModule,
    SearchModule,
    SharedModule,
    TracklistsModule,
    UsersModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'}
  ]
})
export class AppModule {}
