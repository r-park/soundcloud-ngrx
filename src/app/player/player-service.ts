import 'rxjs/add/operator/let';
import 'rxjs/add/operator/pluck';

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PLAYER_INITIAL_VOLUME } from 'app/app-config';
import { ITrack, ITracklistCursor } from 'app/tracklists';
import { IPlayerState, PlayerStateRecord } from './state/player-state';
import { ITimesState, TimesStateRecord } from './state';
import { AudioService } from './audio-service';
import { AudioSource } from './audio-source';
import { PlayerActions } from './player-actions';
import { playerStorage } from './player-storage';
import { getTracklistCursor, TracklistService } from '../tracklists';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class PlayerService extends AudioService {
  currentTime$: Observable<number>;
  cursor$: Observable<ITracklistCursor>;
  player$: Observable<IPlayerState>;
  times$: Observable<ITimesState>;
  track$: Observable<ITrack>;

  private playerSubject: BehaviorSubject<IPlayerState>;
  private timeSubject: BehaviorSubject<ITimesState>;


  constructor(private actions: PlayerActions, audio: AudioSource,
              private tracklistService: TracklistService) {
    super(actions, audio);

    this.events$.subscribe(action => this.dispatchAction(action));
    this.volume = playerStorage.volume || PLAYER_INITIAL_VOLUME;

    // this.player$ = store$.let(getPlayer());
    this.playerSubject = new BehaviorSubject(new PlayerStateRecord() as IPlayerState);
    this.player$ = this.playerSubject.asObservable();

    // this.cursor$ = store$.let(getPlayerTracklistCursor());
    this.cursor$ = this.player$.map(player => player.trackId).distinctUntilChanged()
      .combineLatest(this.tracklistService.tracklist$, getTracklistCursor);

    // this.track$ = store$.let(getPlayerTrack());
    this.track$ = this.player$.map(player => player.trackId).distinctUntilChanged()
      .withLatestFrom(this.tracklistService.allTracks$, (trackId, tracks) => {
        return tracks.get(trackId);
      }).filter(track => !!track).distinctUntilChanged();

    this.track$.subscribe(track => {
      this.play(track.streamUrl);
    });


    this.timeSubject = new BehaviorSubject(new TimesStateRecord() as ITimesState);
    this.times$ = this.timeSubject.asObservable();

    this.currentTime$ = this.times$.pluck('currentTime');
  }


  select({ trackId, tracklistId }: { trackId: number, tracklistId?: string }): void {
    const player = this.playerSubject.getValue();
    const newPlayer = player.merge({
      trackId,
      tracklistId
    }) as IPlayerState;

    this.playerSubject.next(newPlayer);
    this.timeSubject.next(new TimesStateRecord() as ITimesState);
  }

  dispatchAction({ payload, type }: Action): void {
    let player;
    switch (type) {
      case PlayerActions.AUDIO_PLAYING:
        player = this.playerSubject.getValue();
        if (!player.get('isPlaying')) {
          player = player.set('isPlaying', true);
          this.playerSubject.next(player);
        }
        break;

      case PlayerActions.AUDIO_PAUSED:
        player = this.playerSubject.getValue();
        player.set('isPlaying', false);
        this.playerSubject.next(player);
        break;
      case PlayerActions.AUDIO_ENDED:
        player = this.playerSubject.getValue();
        player.set('isPlaying', false);
        this.playerSubject.next(player);
        this.timeSubject.next(new TimesStateRecord() as ITimesState);

        const sub = this.player$.map(player => player.trackId)
          .combineLatest(this.tracklistService.tracklist$, getTracklistCursor)
          .filter(cursor => !!cursor.nextTrackId)
          .subscribe(cursor => {
            this.select({ trackId: cursor.nextTrackId });
          });

        sub.unsubscribe();
        break;

      case PlayerActions.AUDIO_TIME_UPDATED:
        const time = this.timeSubject.getValue();
        const newTime = time.merge(payload) as ITimesState;
        this.timeSubject.next(newTime);
        break;
      case PlayerActions.AUDIO_VOLUME_CHANGED:
        player = this.playerSubject.getValue();
        player.set('volume', payload.volume);
        this.playerSubject.next(player);
        playerStorage.volume = payload.volume;
        break;
      default:
        break;
    }
  }
}
