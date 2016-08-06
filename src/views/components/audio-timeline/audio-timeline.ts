import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { TimesState } from 'src/core/player';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'audio-timeline',
  template: `
    <div [ngStyle]="{'width': times?.percentBuffered}" style="height: 5px; background: #afa;"></div>
    <div [ngStyle]="{'width': times?.percentCompleted}" style="height: 5px; background: #6b6;"></div>
  `
})

export class AudioTimelineComponent {
  @Input() times: TimesState;
  @Output() seek = new EventEmitter(false);

  @HostListener('click', ['$event'])
  onClick(event: any): void {
    const { currentTarget, pageX } = event;
    this.seek.emit(
      (pageX - currentTarget.getBoundingClientRect().left) / currentTarget.offsetWidth * this.times.duration
    );
  }
}
