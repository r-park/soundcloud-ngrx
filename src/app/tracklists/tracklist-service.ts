import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { IAppState } from 'app';
import { ITrack, ITracklist, TracklistRecord } from './models';
import { getTracksForCurrentTracklist } from './state/selectors';
import { TracklistActions } from './tracklist-actions';
import { tracklistIdForUserLikes, tracklistIdForUserTracks } from '../users/utils';
import { ApiService } from '../core/services/api/api-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TRACKS_PER_PAGE } from '../app-config';
import { ITrackData } from './models/track';


@Injectable()
export class TracklistService {
  tracklist$: Observable<ITracklist>;
  tracks$: Observable<List<ITrack>>;

  private tracklistSubject: BehaviorSubject<ITracklist>;

  constructor(private actions: TracklistActions, private store$: Store<IAppState>, private api: ApiService) {
    // this.tracklist$ = store$.let(getCurrentTracklist());
    this.tracks$ = store$.let(getTracksForCurrentTracklist());

    this.tracklistSubject = new BehaviorSubject(new TracklistRecord() as ITracklist);
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

    // +++

    // case TracklistActions.FETCH_TRACKS_FULFILLED:
    //   return state.set(
    //     action.payload.tracklistId,
    //     tracklistReducer(state.get(action.payload.tracklistId), action)
    //   );

      // which triggers another reducer

      // case TracklistActions.FETCH_TRACKS_FULFILLED:
      //   return state.withMutations((tracklist: any) => {
      //     tracklist
      //       .merge({
      //         isNew: false,
      //         isPending: false,
      //         nextUrl: payload.next_href || null,
      //         trackIds: mergeTrackIds(tracklist.trackIds, payload.collection)
      //       })
      //       .merge(updatePagination(tracklist, tracklist.currentPage + 1));
      //   }) as ITracklist;

    // now becomes

    const tracklistId = tracklistIdForUserLikes(userId);
    userId = parseInt(userId as any, 10);

    const tracklist = this.tracklistSubject.getValue();

    let newTracklist;

    if (tracklist.isNew) {
      this.api.fetchUserLikes(userId).subscribe(data => {
        newTracklist
          .merge({
            isNew: false,
            isPending: false,
            nextUrl: data.next_href || null,
            trackIds: TracklistService.mergeTrackIds(tracklist.trackIds, data.collection)
          })
          .merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1));
        this.tracklistSubject.next(newTracklist);
      });

      newTracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;
    } else {
      newTracklist = tracklist.merge(TracklistService.updatePagination(tracklist, 1)) as ITracklist;
      this.tracklistSubject.next(newTracklist);
    }
  }

  loadUserTracks(userId: number|string): void {
    // this.store$.dispatch(
    //   this.actions.loadUserTracks(userId)
    // );

    const tracklistId = tracklistIdForUserTracks(userId);
    userId = parseInt(userId as any, 10);

    const tracklist = this.tracklistSubject.getValue();

    let newTracklist;

    if (tracklist.isNew) {
      newTracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;

      this.api.fetchUserTracks(userId).subscribe(data => {
        newTracklist
          .merge({
            isNew: false,
            isPending: false,
            nextUrl: data.next_href || null,
            trackIds: TracklistService.mergeTrackIds(tracklist.trackIds, data.collection)
          })
          .merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1));
        this.tracklistSubject.next(newTracklist);
      });
    } else {
      newTracklist = tracklist.merge(TracklistService.updatePagination(tracklist, 1)) as ITracklist;
      this.tracklistSubject.next(newTracklist);
    }

  }

  static updatePagination(tracklist: ITracklist, page: number): any {
    let pageCount = Math.ceil(tracklist.trackIds.size / TRACKS_PER_PAGE);
    let currentPage = Math.min(page, pageCount);
    let hasNextPageInStore = currentPage < pageCount;
    let hasNextPage = hasNextPageInStore || tracklist.nextUrl !== null;

    return {
      currentPage,
      hasNextPage,
      hasNextPageInStore,
      pageCount
    };
  }

  static mergeTrackIds(trackIds: List<number>, collection: ITrackData[]): List<number> {
    let ids = trackIds.toJS();

    let newIds = collection.reduce((list, trackData) => {
      if (ids.indexOf(trackData.id) === -1) list.push(trackData.id);
      return list;
    }, []);

    return newIds.length ? List<number>(ids.concat(newIds)) : trackIds;
  }

}
