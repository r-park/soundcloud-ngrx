import { APP_BASE_HREF } from '@angular/common';
import { provideRouter, Routes } from '@ngrx/router';

import { HomePageComponent } from './pages/home';
import { SearchPageComponent } from './pages/search';
import { UserPageComponent } from './pages/user';


const routes: Routes = [
  {path: '/', component: HomePageComponent},
  {path: '/search', component: SearchPageComponent},
  {path: '/users/:id(\\d+)/:resource(likes|tracks)', component: UserPageComponent}
];


export const ROUTER_PROVIDERS = [
  {provide: APP_BASE_HREF, useValue: '/'},
  provideRouter(routes)
];
