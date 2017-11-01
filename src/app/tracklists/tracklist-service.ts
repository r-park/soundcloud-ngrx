import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { IAppState } from 'app';
import { ITrack, ITracklist } from './models';
import { getTracksForCurrentTracklist } from './state/selectors';
import { TracklistActions } from './tracklist-actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { tracklistIdForUserLikes } from '../users/utils';
import { ApiService } from '../core/services/api/api-service';


@Injectable()
export class TracklistService {
  tracklist$: Observable<ITracklist>;
  tracks$: Observable<List<ITrack>>;

  private tracklistSubject: ReplaySubject<ITracklist>;

  constructor(private actions: TracklistActions, private store$: Store<IAppState>, private api: ApiService) {
    // this.tracklist$ = store$.let(getCurrentTracklist());
    this.tracks$ = store$.let(getTracksForCurrentTracklist());

    this.tracklistSubject = new ReplaySubject<ITracklist>(1);
    this.tracklist$ = this.tracklistSubject.asObservable();
  }

  loadFeaturedTracks(): void {
    this.store$.dispatch(
      this.actions.loadFeaturedTracks()
    );
  }

  loadNextTracks(): void {
    this.store$.dispatch(
      this.actions.loadNextTracks()
    );
  }

  // moved from UserService
  loadResource(userId: number|string, resource: string): void {
    switch (resource) {
      case 'likes':
        this.loadUserLikes(userId);
        break;

      case 'tracks':
        this.loadUserTracks(userId);
        break;
    }
  }

  loadUserLikes(userId: number|string): void {
    // this.store$.dispatch(
    //   this.actions.loadUserLikes(userId)
    // );

    // triggers

    // loadUserLikes(userId: any): Action {
    //   return {
    //     type: UserActions.LOAD_USER_LIKES,
    //     payload: {
    //       tracklistId: tracklistIdForUserLikes(userId),
    //       userId: parseInt(userId, 10)
    //     }
    //   };
    // }

    // +++

    // case UserActions.LOAD_USER_LIKES:
    //   return state.withMutations(tracklists => {
    //     const { tracklistId } = action.payload;
    //     tracklists
    //       .set('currentTracklistId', tracklistId)
    //       .set(tracklistId, tracklistReducer(tracklists.get(tracklistId), action));
    //   });

      // which triggers another reducer

      // return state.isNew ?
      //   state.merge({id: payload.tracklistId, isPending: true}) as ITracklist :
      //   state.merge(updatePagination(state, 1)) as ITracklist;

    // +++

    // loadUserLikes$ = this.actions$
    //   .ofType(UserActions.LOAD_USER_LIKES, TracklistActions.LOAD_FEATURED_TRACKS)
    //   .withLatestFrom(this.store$.let(getCurrentTracklist()), (action, tracklist) => ({
    //     payload: action.payload,
    //     tracklist
    //   }))
    //   .filter(({tracklist}) => tracklist.isNew)
    //   .switchMap(({payload}) => this.api.fetchUserLikes(payload.userId)
    //     .map(data => this.tracklistActions.fetchTracksFulfilled(data, payload.tracklistId))
    //     .catch(error => Observable.of(this.tracklistActions.fetchTracksFailed(error)))
    //   );

    // now becomes

    // export type TracklistsState = Map<string,any>;
    //
    // export const initialState: TracklistsState = Map<string,any>({
    //   currentTracklistId: null
    // });

    const tracklistId = tracklistIdForUserLikes(userId);
    userId = parseInt(userId as any, 10);

    this.api.fetchUserLikes(userId).subscribe();
  }

  loadUserTracks(userId: number|string): void {
    // this.store$.dispatch(
    //   this.actions.loadUserTracks(userId)
    // );
  }
}
