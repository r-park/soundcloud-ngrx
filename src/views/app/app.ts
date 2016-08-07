import { Component } from '@angular/core';
import { PlayerComponent } from '../components/player';
import { SearchFormComponent } from '../components/search-form';


@Component({
  directives: [
    PlayerComponent,
    SearchFormComponent
  ],
  selector: 'app',
  template: `
    <main>
      <player></player>

      <br><br>

      <search-form></search-form>

      <br><br>

      <route-view></route-view>
    </main>
  `
})

export class App {}
