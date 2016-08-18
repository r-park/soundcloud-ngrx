import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { IconComponent } from '../icon';


@Component({
  directives: [
    IconComponent
  ],
  encapsulation: ViewEncapsulation.None,
  selector: 'icon-button',
  styles: [
    require('./icon-button.scss')
  ],
  template: `
    <button
      [attr.aria-label]="label"
      class="btn btn--icon btn--{{icon}} {{className}}"
      (click)="onClick.emit($event)"
      type="button">
      <icon [name]="icon"></icon>
    </button>
  `
})

export class IconButtonComponent {
  @Input() className: string;
  @Input() icon: string;
  @Input() label: string;

  @Output() onClick = new EventEmitter(false);
}
