import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayerService } from 'src/core/player';
import { PlayerControlsComponent } from '../player-controls';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    PlayerControlsComponent
  ],
  selector: 'player',
  template: `
    <player-controls
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
