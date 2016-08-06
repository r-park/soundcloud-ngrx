import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayerService } from 'src/core/player';
import { TracklistService } from 'src/core/tracklists';
import { TracklistItemsComponent } from './tracklist-items';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    TracklistItemsComponent
  ],
  selector: 'tracklist',
  template: `
    <tracklist-items
      [player]="player.player$ | async"
      [tracklist]="tracklist.tracklist$ | async"
      [tracks]="tracklist.tracks$"
      (pause)="player.pause()"
      (play)="player.play()"
      (seek)="player.seek($event)"
      (select)="player.select($event)"
      (loadNextTracks)="tracklist.loadNextTracks()"></tracklist-items>
  `
})

export class TracklistComponent {
  constructor(public player: PlayerService, public tracklist: TracklistService) {}
}
