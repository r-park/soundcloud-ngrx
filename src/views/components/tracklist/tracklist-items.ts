import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { Tracklist } from 'src/core/tracklists';
import { Track } from 'src/core/tracks';
import { TrackCardComponent } from '../track-card';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    TrackCardComponent
  ],
  selector: 'tracklist-items',
  template: `
    <div *ngIf="tracklist">
      <track-card
        *ngFor="let track of tracks | async"
        [track]="track"></track-card>
  
      <div *ngIf="tracklist.isPending">
        <h1>Loading Tracks</h1>
      </div>
  
      <div *ngIf="tracklist.hasNextPage">
        <button (click)="loadNextTracks.emit()" type="button">Next</button>
      </div>
    </div>
  `
})

export class TracklistItemsComponent {
  @Input() tracklist: Tracklist;
  @Input() tracks: Observable<List<Track>>;

  @Output() loadNextTracks = new EventEmitter(false);
}
