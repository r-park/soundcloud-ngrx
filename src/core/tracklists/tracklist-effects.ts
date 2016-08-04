import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Effect, StateUpdates } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'src/core/api';
import { AppState } from 'src/core/interfaces';
import { toState } from 'src/core/utils/effects';
import { getCurrentTracklist } from './selectors';
import { TracklistActions } from './tracklist-actions';


@Injectable()
export class TracklistEffects {
  constructor(
    private actions: TracklistActions,
    private api: ApiService,
    private updates$: StateUpdates<AppState>
  ) {}

  @Effect()
  loadNextTracks$: Observable<Action> = this.updates$
    .whenAction(TracklistActions.LOAD_NEXT_TRACKS)
    .map(toState)
    .let(getCurrentTracklist())
    .filter(tracklist => tracklist.isPending)
    .switchMap(tracklist => this.api.fetch(tracklist.nextUrl)
      .map(data => this.actions.fetchTracksFulfilled(data, tracklist.id))
      .catch(error => Observable.of(this.actions.fetchTracksFailed(error)))
    );
}
