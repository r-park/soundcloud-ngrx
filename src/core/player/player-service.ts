import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PLAYER_INITIAL_VOLUME } from 'src/core/constants';
import { AppState } from 'src/core/interfaces';
import { TracklistCursor } from 'src/core/tracklists';
import { Track } from 'src/core/tracks';
import { AudioService } from './audio-service';
import { AudioSource } from './audio-source';
import { PlayerActions } from './player-actions';
import { PlayerState } from './player-state';
import { playerStorage } from './player-storage';
import { getPlayer, getPlayerTrack, getPlayerTracklistCursor } from './selectors';


@Injectable()
export class PlayerService extends AudioService {
  cursor$: Observable<TracklistCursor>;
  player$: Observable<PlayerState>;
  track$: Observable<Track>;


  constructor(private actions: PlayerActions, audio: AudioSource, private store$: Store<AppState>) {
    super(actions, audio);

    this.events$.subscribe(action => store$.dispatch(action));
    this.volume = playerStorage.volume || PLAYER_INITIAL_VOLUME;

    this.cursor$ = store$.let(getPlayerTracklistCursor());
    this.player$ = store$.let(getPlayer());

    this.track$ = store$.let(getPlayerTrack());
    this.track$.subscribe(track => this.play(track.streamUrl));
  }


  select({trackId, tracklistId}: {trackId: number, tracklistId: string}): void {
    this.store$.dispatch(
      this.actions.playSelectedTrack(trackId, tracklistId)
    );
  }
}
