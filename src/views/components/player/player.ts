import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayerService } from 'src/core/player';
import { AudioTimelineComponent } from '../audio-timeline';
import { PlayerControlsComponent } from '../player-controls';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    AudioTimelineComponent,
    PlayerControlsComponent
  ],
  selector: 'player',
  template: `
    <div>
      <audio-timeline
        style="display: block;"
        [times]="player.times$ | async"
        (seek)="player.seek($event)"></audio-timeline>
    </div>

    <player-controls
      [currentTime]="player.currentTime$"
      [cursor]="player.cursor$ | async"
      [player]="player.player$ | async"
      [track]="player.track$ | async"
      (decreaseVolume)="player.decreaseVolume()"
      (increaseVolume)="player.increaseVolume()"
      (pause)="player.pause()"
      (play)="player.play()"
      (select)="player.select({trackId: $event})"></player-controls>
  `
})

export class PlayerComponent {
  constructor(public player: PlayerService) {}
}
