import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerState } from 'src/core/player';
import { TracklistCursor } from 'src/core/tracklists';
import { Track } from 'src/core/tracks';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'player-controls',
  template: `
    <div *ngIf="track">
      <div>
        <button (click)="previous()">Previous</button>
        <button (click)="pause.emit()">Pause</button>
        <button (click)="play.emit()">Play</button>
        <button (click)="next()">Next</button>
      </div>

      <div>{{track.title}}</div>

      <div>
        <button (click)="decreaseVolume.emit()">–</button>
        <span>{{player.volume}}</span>
        <button (click)="increaseVolume.emit()">+</button>
      </div>
    </div>
  `
})

export class PlayerControlsComponent {
  @Input() cursor: TracklistCursor;
  @Input() player: PlayerState;
  @Input() track: Track;

  @Output() decreaseVolume = new EventEmitter(false);
  @Output() increaseVolume = new EventEmitter(false);
  @Output() pause = new EventEmitter(false);
  @Output() play = new EventEmitter(false);
  @Output() select = new EventEmitter(false);

  next(): void {
    if (this.cursor.nextTrackId) {
      this.select.emit(this.cursor.nextTrackId);
    }
  }

  previous(): void {
    if (this.cursor.previousTrackId) {
      this.select.emit(this.cursor.previousTrackId);
    }
  }
}
