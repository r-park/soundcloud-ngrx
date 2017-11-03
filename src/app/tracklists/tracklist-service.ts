import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { IAppState } from 'app';
import { ITrack, ITracklist, TracklistRecord } from './models';
import { TracklistActions } from './tracklist-actions';
import { tracklistIdForUserLikes, tracklistIdForUserTracks } from '../users/utils';
import { ApiService } from '../core/services/api/api-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FEATURED_TRACKLIST_ID, FEATURED_TRACKLIST_USER_ID, TRACKS_PER_PAGE } from '../app-config';
import { createTrack, ITrackData } from './models/track';


@Injectable()
export class TracklistService {
  // todo: merge tracklist and tracks
  tracklist$: Observable<ITracklist>;
  tracks$: Observable<List<ITrack>>;
  private allTracks$: Observable<Map<number,ITrack>>;

  private tracklistSubject: BehaviorSubject<ITracklist>;
  private allTracksSubject: BehaviorSubject<Map<number,ITrack>>;

  constructor(private actions: TracklistActions, private store$: Store<IAppState>, private api: ApiService) {
    // this.tracklist$ = store$.let(getCurrentTracklist());
    // this.tracks$ = store$.let(getTracksForCurrentTracklist());

    this.tracklistSubject = new BehaviorSubject(new TracklistRecord() as ITracklist);
    this.tracklist$ = this.tracklistSubject.asObservable();

    this.allTracksSubject = new BehaviorSubject(new Map<number,ITrack>());
    this.allTracks$ = this.allTracksSubject.asObservable();

    // assumption here
    this.tracks$ = this.tracklist$.withLatestFrom(this.allTracks$, (tracklist, tracks) => {
      return tracklist.trackIds
        .slice(0, tracklist.currentPage * TRACKS_PER_PAGE)
        .map(id => tracks.get(id)) as List<ITrack>;
    });
  }

  loadFeaturedTracks(): void {
    // this.store$.dispatch(
    //   this.actions.loadFeaturedTracks()
    // );

    const tracklistId = FEATURED_TRACKLIST_ID;
    const userId = FEATURED_TRACKLIST_USER_ID;

    this.loadFavoriteTracks(userId, tracklistId);
  }

  loadNextTracks(): void {
    // this.store$.dispatch(
    //   this.actions.loadNextTracks()
    // );

    // case TracklistActions.LOAD_NEXT_TRACKS:
    //   return state.set(
    //     state.get('currentTracklistId'),
    //     tracklistReducer(state.get(state.get('currentTracklistId')), action)
    //   );

    // +++

    // case TracklistActions.LOAD_NEXT_TRACKS:
    //   return state.hasNextPageInStore ?
    //     state.merge(updatePagination(state, state.currentPage + 1)) as ITracklist :
    //     state.set('isPending', true) as ITracklist;

    // +++

    // loadNextTracks$ = this.actions$
    //   .ofType(TracklistActions.LOAD_NEXT_TRACKS)
    //   .withLatestFrom(this.store$.let(getCurrentTracklist()), (action, tracklist) => tracklist)
    //   .filter(tracklist => tracklist.isPending)
    //   .switchMap(tracklist => this.api.fetch(tracklist.nextUrl)
    //     .map(data => this.tracklistActions.fetchTracksFulfilled(data, tracklist.id))
    //     .catch(error => Observable.of(this.tracklistActions.fetchTracksFailed(error)))
    //   );

    let tracklist = this.tracklistSubject.getValue();

    if (tracklist.hasNextPageInStore) {
      tracklist = tracklist.merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1)) as ITracklist;
      this.tracklistSubject.next(tracklist);

    } else {
      tracklist = tracklist.set('isPending', true) as ITracklist;
      this.tracklistSubject.next(tracklist);

      this.api.fetch(tracklist.nextUrl).subscribe(data => {
        const newTracklist = tracklist.withMutations((tracklist: any) => {
          tracklist.merge({
            isNew: false,
            isPending: false,
            nextUrl: data.next_href || null,
            trackIds: TracklistService.mergeTrackIds(tracklist.trackIds, data.collection)
          }).merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1));
        }) as ITracklist;


        let allTacks = this.allTracksSubject.getValue();
        data.collection.forEach((d: ITrackData) => {
          allTacks.set(d.id, createTrack(d));
        });

        this.allTracksSubject.next(allTacks);
        this.tracklistSubject.next(newTracklist);
      });
    }
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

    this.loadFavoriteTracks(userId, tracklistId);
  }

  loadUserTracks(userId: number|string): void {
    // this.store$.dispatch(
    //   this.actions.loadUserTracks(userId)
    // );

    const tracklistId = tracklistIdForUserTracks(userId);
    userId = parseInt(userId as any, 10);

    this.loadTracks(userId, tracklistId);
  }

  loadSearchTracks(query: any, tracklistId: string): void {
    let tracklist = new TracklistRecord() as ITracklist;

    tracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;
    this.tracklistSubject.next(tracklist);

    this.api.fetchSearchResults(query).subscribe(data => {
      const newTracklist = tracklist.withMutations((tracklist: any) => {
        tracklist.merge({
          isNew: false,
          isPending: false,
          nextUrl: data.next_href || null,
          trackIds: TracklistService.mergeTrackIds(tracklist.trackIds, data.collection)
        }).merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1));
      }) as ITracklist;

      let allTacks = this.allTracksSubject.getValue();
      data.collection.forEach((d: ITrackData) => {
        allTacks.set(d.id, createTrack(d));
      });

      this.allTracksSubject.next(allTacks);
      this.tracklistSubject.next(newTracklist);
    });
  }


  private loadFavoriteTracks(userId: any, tracklistId: string): void {
    let tracklist = new TracklistRecord() as ITracklist;

    tracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;
    this.tracklistSubject.next(tracklist);

    this.api.fetchUserLikes(userId).subscribe(data => {
      const newTracklist = tracklist.withMutations((tracklist: any) => {
        tracklist.merge({
          isNew: false,
          isPending: false,
          nextUrl: data.next_href || null,
          trackIds: TracklistService.mergeTrackIds(tracklist.trackIds, data.collection)
        }).merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1));
      }) as ITracklist;

      let allTacks = this.allTracksSubject.getValue();
      data.collection.forEach((d: ITrackData) => {
        allTacks.set(d.id, createTrack(d));
      });

      this.allTracksSubject.next(allTacks);
      this.tracklistSubject.next(newTracklist);
    });
  }

  private loadTracks(userId: any, tracklistId: string): void {
    let tracklist = new TracklistRecord() as ITracklist;

    tracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;
    this.tracklistSubject.next(tracklist);

    this.api.fetchUserTracks(userId).subscribe(data => {
      const newTracklist = tracklist.withMutations((tracklist: any) => {
        tracklist.merge({
          isNew: false,
          isPending: false,
          nextUrl: data.next_href || null,
          trackIds: TracklistService.mergeTrackIds(tracklist.trackIds, data.collection)
        }).merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1));
      }) as ITracklist;

      let allTacks = this.allTracksSubject.getValue();
      data.collection.forEach((d: ITrackData) => {
        allTacks.set(d.id, createTrack(d));
      });

      this.allTracksSubject.next(allTacks);
      this.tracklistSubject.next(newTracklist);
    });
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
