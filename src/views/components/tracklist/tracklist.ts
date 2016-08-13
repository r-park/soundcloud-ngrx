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
      [times]="player.times$"
      [tracklist]="tracklist.tracklist$ | async"
      [tracks]="tracklist.tracks$"
      (loadNextTracks)="tracklist.loadNextTracks()"
      (pause)="player.pause()"
      (play)="player.play()"
      (seek)="player.seek($event)"
      (select)="player.select($event)"></tracklist-items>
  `
})

export class TracklistComponent {
  constructor(public player: PlayerService, public tracklist: TracklistService) {}
}
