import { Component } from '@angular/core';

import { AppHeaderComponent } from '../components/app-header';
import { PlayerComponent } from '../components/player';


@Component({
  directives: [
    AppHeaderComponent,
    PlayerComponent
  ],
  selector: 'app',
  styles: [`
    .main {
      padding-bottom: 200px;
    }
  `],
  template: `
    <app-header></app-header>

    <main class="main">
      <route-view></route-view>
    </main>

    <player></player>
  `
})

export class AppComponent {}
