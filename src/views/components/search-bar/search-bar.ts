import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { FormControl, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Router } from '@ngrx/router';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    REACTIVE_FORM_DIRECTIVES
  ],
  selector: 'search-bar',
  styles: [
    require('./search-bar.scss')
  ],
  template: `
    <div class="search-bar" [ngClass]="{'search-bar--open': open}" role="search">
      <form class="search-form" (ngSubmit)="submit()" novalidate>
        <input
          [formControl]="searchInput"
          autocomplete="off"
          class="search-form__input"
          maxlength="60"
          placeholder="Search Tracks"
          required
          type="text">
      </form>
    </div>
  `
})

export class SearchBarComponent {
  @Input() open = false;

  searchInput = new FormControl();
  searchInputEl: HTMLInputElement;

  constructor(public el: ElementRef, public router: Router) {}

  ngOnChanges(changes: any): void {
    if (changes.open.currentValue) {
      this.searchInput.updateValue('');
    }
  }

  ngOnInit(): void {
    this.searchInputEl = this.el.nativeElement.querySelector('input');

    this.el.nativeElement
      .querySelector('.search-bar')
      .addEventListener('transitionend', () => {
        if (this.open) {
          this.searchInputEl.focus();
        }
      }, false);
  }

  submit(): void {
    if (this.searchInput.valid) {
      const value = this.searchInput.value.trim();
      if (value.length) {
        this.router.go('/search', {q: value});
        this.searchInputEl.blur();
      }
    }
  }
}
