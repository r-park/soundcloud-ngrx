import { Component } from '@angular/core';
import { SearchFormComponent } from '../components/search-form';


@Component({
  directives: [
    SearchFormComponent
  ],
  selector: 'app',
  template: `
    <main>
      <search-form></search-form>
      
      <br><br>
      
      <route-view></route-view>
    </main>
  `
})

export class App {}
