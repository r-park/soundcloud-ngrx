import { APP_BASE_HREF } from '@angular/common';
import { provideRouter, Routes } from '@ngrx/router';
import { HomePage } from './pages/home';


const routes: Routes = [
  {path: '/', component: HomePage}
];


export const ROUTER_PROVIDERS = [
  {provide: APP_BASE_HREF, useValue: '/'},
  provideRouter(routes)
];
