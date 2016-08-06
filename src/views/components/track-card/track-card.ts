import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from 'src/core/tracks';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'track-card',
  template: `
    <div style="border-top: 1px solid #ddd;">
      <div>{{track.title}}</div>
      
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
  @Input() track: Track;

  @Output() pause = new EventEmitter(false);
  @Output() play = new EventEmitter(false);
  @Output() seek = new EventEmitter(false);
}
