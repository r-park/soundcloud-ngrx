import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Router } from '@ngrx/router';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    REACTIVE_FORM_DIRECTIVES
  ],
  selector: 'search-form',
  template: `
    <div role="search">
      <form (submit)="submit()" novalidate>
        <input
          [formControl]="searchInput"
          autocomplete="off"
          maxlength="60"
          placeholder="Search Tracks"
          required
          type="text">
      </form>
    </div>
  `
})

export class SearchFormComponent {
  searchInput = new FormControl();

  constructor(public router: Router) {}

  submit(): void {
    if (this.searchInput.valid) {
      const value = this.searchInput.value.trim();
      if (value.length) {
        this.router.go('/search', {q: value});
      }
    }
  }
}
