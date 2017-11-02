import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IAppState } from 'app';
import { SearchActions } from './search-actions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TracklistService } from '../tracklists/tracklist-service';
import { tracklistIdForSearch } from './utils';


@Injectable()
export class SearchService {
  query$: Observable<string>;

  private querySubject: BehaviorSubject<string>;

  constructor(private actions: SearchActions, private store$: Store<IAppState>, private tracklistService: TracklistService) {
    // this.query$ = store$.let(getSearchQuery());
    this.querySubject = new BehaviorSubject(null);
    this.query$ = this.querySubject.asObservable();
  }

  loadSearchResults(query: string): void {
    if (typeof query === 'string' && query.length) {
      //   this.store$.dispatch(
      //     this.actions.loadSearchResults(query)
      //   );
      // }

      // triggers

      // case SearchActions.LOAD_SEARCH_RESULTS:
      //   return state.set('query', action.payload.query) as ISearchState;

      // +++

      // case SearchActions.LOAD_SEARCH_RESULTS:
      // case UserActions.LOAD_USER_LIKES:
      // case UserActions.LOAD_USER_TRACKS:
      //   return state.withMutations(tracklists => {
      //     const { tracklistId } = action.payload;
      //     tracklists
      //       .set('currentTracklistId', tracklistId)
      //       .set(tracklistId, tracklistReducer(tracklists.get(tracklistId), action));
      //   });

      // +++

      // case SearchActions.LOAD_SEARCH_RESULTS:
      // case UserActions.LOAD_USER_LIKES:
      // case UserActions.LOAD_USER_TRACKS:
      //   return state.isNew ?
      //     state.merge({id: payload.tracklistId, isPending: true}) as ITracklist :
      //     state.merge(updatePagination(state, 1)) as ITracklist;

      // +++

      // loadSearchResults$ = this.actions$
      //   .ofType(SearchActions.LOAD_SEARCH_RESULTS)
      //   .withLatestFrom(this.store$.let(getCurrentTracklist()), (action, tracklist) => ({
      //     payload: action.payload,
      //     tracklist
      //   }))
      //   .filter(({tracklist}) => tracklist.isNew)
      //   .switchMap(({payload}) => this.api.fetchSearchResults(payload.query)
      //     .map(data => this.tracklistActions.fetchTracksFulfilled(data, payload.tracklistId))
      //     .catch(error => Observable.of(this.tracklistActions.fetchTracksFailed(error)))
      //   );

      this.querySubject.next(query);
      this.tracklistService.loadSearchTracks(query, tracklistIdForSearch(query));

    }
  }
}
