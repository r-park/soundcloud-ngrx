import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'src/core/api';
import { AppState } from 'src/core/interfaces';
import { getCurrentTracklist, TracklistActions } from 'src/core/tracklists';
import { applySelector } from 'src/core/utils/effects';
import { getCurrentUser } from './selectors';
import { UserActions } from './user-actions';


@Injectable()
export class UserEffects {
  constructor(
    private api: ApiService,
    private tracklistActions: TracklistActions,
    private updates$: StateUpdates<AppState>,
    private userActions: UserActions
  ) {}

  @Effect()
  loadUser$: Observable<Action> = this.updates$
    .whenAction(UserActions.LOAD_USER)
    .let(applySelector(getCurrentUser()))
    .filter(update => !update.state || !update.state.profile)
    .map(toPayload)
    .switchMap(payload => this.api.fetchUser(payload.userId)
      .map(data => this.userActions.fetchUserFulfilled(data))
      .catch(error => Observable.of(this.userActions.fetchUserFailed(error)))
    );

  @Effect()
  loadUserLikes$: Observable<Action> = this.updates$
    .whenAction(UserActions.LOAD_USER_LIKES, TracklistActions.LOAD_FEATURED_TRACKS)
    .let(applySelector(getCurrentTracklist()))
    .filter(update => update.state.isNew)
    .map(toPayload)
    .switchMap(payload => this.api.fetchUserLikes(payload.userId)
      .map(data => this.tracklistActions.fetchTracksFulfilled(data, payload.tracklistId))
      .catch(error => Observable.of(this.tracklistActions.fetchTracksFailed(error)))
    );

  @Effect()
  loadUserTracks$: Observable<Action> = this.updates$
    .whenAction(UserActions.LOAD_USER_TRACKS)
    .let(applySelector(getCurrentTracklist()))
    .filter(update => update.state.isNew)
    .map(toPayload)
    .switchMap(payload => this.api.fetchUserTracks(payload.userId)
      .map(data => this.tracklistActions.fetchTracksFulfilled(data, payload.tracklistId))
      .catch(error => Observable.of(this.tracklistActions.fetchTracksFailed(error)))
    );
}
