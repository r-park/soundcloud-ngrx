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
import { SearchActions } from './search-actions';


@Injectable()
export class SearchEffects {
  constructor(
    private api: ApiService,
    private tracklistActions: TracklistActions,
    private updates$: StateUpdates<AppState>
  ) {}

  @Effect()
  loadSearchResults$: Observable<Action> = this.updates$
    .whenAction(SearchActions.LOAD_SEARCH_RESULTS)
    .let(applySelector(getCurrentTracklist()))
    .filter(update => update.state.isNew)
    .map(toPayload)
    .switchMap(payload => this.api.fetchSearchResults(payload.query)
      .map(data => this.tracklistActions.fetchTracksFulfilled(data, payload.tracklistId))
      .catch(error => Observable.of(this.tracklistActions.fetchTracksFailed(error)))
    );
}
