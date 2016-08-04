import { ChangeDetectionStrategy, Component } from '@angular/core';
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
      [tracklist]="tracklist.tracklist$ | async"
      [tracks]="tracklist.tracks$"
      (loadNextTracks)="tracklist.loadNextTracks()"></tracklist-items>
  `
})

export class TracklistComponent {
  constructor(public tracklist: TracklistService) {}
}
