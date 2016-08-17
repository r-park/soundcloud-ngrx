import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PlayerService } from 'src/core/player';
import { TracklistService } from 'src/core/tracklists';
import { TracklistItemsComponent } from './tracklist-items';
import { TracklistScrollService } from './tracklist-scroll-service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    TracklistItemsComponent
  ],
  providers: [
    TracklistScrollService
  ],
  selector: 'tracklist',
  template: `
    <tracklist-items
      [player]="player.player$ | async"
      [times]="player.times$"
      [tracklist]="tracklist.tracklist$ | async"
      [tracks]="tracklist.tracks$"
      (pause)="player.pause()"
      (play)="player.play()"
      (seek)="player.seek($event)"
      (select)="player.select($event)"></tracklist-items>
  `
})

export class TracklistComponent {
  ngOnDestroy$ = new Subject<boolean>();

  constructor(
    public player: PlayerService,
    public scroll: TracklistScrollService,
    public tracklist: TracklistService
  ) {}

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }

  ngOnInit(): void {
    this.scroll.infinite(this.ngOnDestroy$);
  }
}
