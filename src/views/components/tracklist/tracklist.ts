import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MediaQueryService } from 'src/core/browser';
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
      [layout]="layout"
      [media]="mediaQuery.matches$ | async"
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
  @Input() layout: string;

  ngOnDestroy$ = new Subject<boolean>();

  constructor(
    public mediaQuery: MediaQueryService,
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
