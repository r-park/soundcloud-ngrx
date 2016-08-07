import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { PlayerState, TimesState } from 'src/core/player';
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
        [isPlaying]="track.id === player.trackId && player.isPlaying"
        [isSelected]="track.id === player.trackId"
        [times]="times"
        [track]="track"
        (pause)="pause.emit()"
        (play)="track.id === player.trackId ? play.emit() : select.emit({trackId: track.id, tracklistId: tracklist.id})"
        (seek)="seek.emit($event)"></track-card>

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
  @Input() player: PlayerState;
  @Input() times: Observable<TimesState>;
  @Input() tracklist: Tracklist;
  @Input() tracks: Observable<List<Track>>;

  @Output() loadNextTracks = new EventEmitter(false);
  @Output() pause = new EventEmitter(false);
  @Output() play = new EventEmitter(false);
  @Output() seek = new EventEmitter(false);
  @Output() select = new EventEmitter(false);
}
