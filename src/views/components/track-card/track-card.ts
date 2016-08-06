import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TimesState } from 'src/core/player';
import { Track } from 'src/core/tracks';
import { FormatTimePipe } from '../../pipes/format-time';
import { AudioTimelineComponent } from '../audio-timeline';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    AudioTimelineComponent
  ],
  pipes: [
    FormatTimePipe
  ],
  selector: 'track-card',
  template: `
    <div style="border-top: 1px solid #ddd;">
      <div>{{track.title}}</div>
      
      <audio-timeline
        *ngIf="isSelected"
        style="display: block;"
        [times]="times | async"
        (seek)="seek.emit($event)"></audio-timeline>
      
      <div>isPlaying: {{isPlaying}}</div>
      <div>isSelected: {{isSelected}}</div>
      
      <button (click)="pause.emit()" type="button">Pause</button>
      <button (click)="play.emit()" type="button">Play</button>
    </div>
  `
})

export class TrackCardComponent {
  @Input() isPlaying: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() times: Observable<TimesState>;
  @Input() track: Track;

  @Output() pause = new EventEmitter(false);
  @Output() play = new EventEmitter(false);
  @Output() seek = new EventEmitter(false);
}
