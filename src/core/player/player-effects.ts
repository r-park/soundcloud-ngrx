import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from 'src/core/interfaces';
import { toState } from 'src/core/utils/effects';
import { PlayerActions } from './player-actions';
import { playerStorage } from './player-storage';
import { getPlayerTracklistCursor } from './selectors';


@Injectable()
export class PlayerEffects {
  constructor(
    private actions: PlayerActions,
    private updates$: StateUpdates<AppState>
  ) {}

  @Effect()
  audioEnded$: Observable<Action> = this.updates$
    .whenAction(PlayerActions.AUDIO_ENDED)
    .map(toState)
    .let(getPlayerTracklistCursor(false))
    .filter(cursor => !!cursor.nextTrackId)
    .map(cursor => this.actions.playSelectedTrack(cursor.nextTrackId));

  @Effect()
  audioVolumeChanged$: Observable<Action> = this.updates$
    .whenAction(PlayerActions.AUDIO_VOLUME_CHANGED)
    .map(toPayload)
    .do(payload => playerStorage.volume = payload.volume)
    .ignoreElements();
}
