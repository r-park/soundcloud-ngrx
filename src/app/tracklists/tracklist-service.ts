import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { ITrack, ITracklist, TracklistRecord } from './models';
import { tracklistIdForUserLikes, tracklistIdForUserTracks } from '../users/utils';
import { ApiService } from '../core/services/api';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FEATURED_TRACKLIST_ID, FEATURED_TRACKLIST_USER_ID, TRACKS_PER_PAGE } from '../app-config';
import { createTrack, ITrackData } from './models';

import { IPaginatedData } from '../core/services/api/interfaces';
import { Subscriber } from 'rxjs/Subscriber';


@Injectable()
export class TracklistService {
  tracklist$: Observable<ITracklist>;
  tracks$: Observable<List<ITrack>>;
  allTracks$: Observable<Map<number,ITrack>>;

  private tracklistSubject: BehaviorSubject<ITracklist>;
  private allTracksSubject: BehaviorSubject<Map<number,ITrack>>;


  constructor(private api: ApiService) {
    this.tracklistSubject = new BehaviorSubject(new TracklistRecord() as ITracklist);
    this.tracklist$ = this.tracklistSubject.asObservable();

    this.allTracksSubject = new BehaviorSubject(new Map<number,ITrack>());
    this.allTracks$ = this.allTracksSubject.asObservable();

    // assumption here?
    this.tracks$ = this.tracklist$.withLatestFrom(this.allTracks$, (tracklist, tracks) => {
      return tracklist.trackIds
        .slice(0, tracklist.currentPage * TRACKS_PER_PAGE)
        .map(id => tracks.get(id)) as List<ITrack>;
    });
  }

  mountTracklist(tracklist: ITracklist): void {
    this.tracklistSubject.next(tracklist);
  }

  mountAllTracks(tracks: Map<number,ITrack>): void {
    this.allTracksSubject.next(tracks);
  }

  loadFeaturedTracks(): void {
    this.loadFavoriteTracks(FEATURED_TRACKLIST_USER_ID, FEATURED_TRACKLIST_ID);
  }

  loadNextTracks(): void {
    let tracklist = this.tracklistSubject.getValue();

    if (tracklist.hasNextPageInStore) {
      tracklist = tracklist.merge(TracklistService.updatePagination(tracklist, tracklist.currentPage + 1)) as ITracklist;
      this.tracklistSubject.next(tracklist);

    } else if (tracklist.hasNextPage && tracklist.nextUrl) {
      tracklist = tracklist.set('isPending', true) as ITracklist;
      this.tracklistSubject.next(tracklist);
      this.api.fetch(tracklist.nextUrl).subscribe(this.tracksFetchedHandler(tracklist));
    }
  }

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
    const tracklistId = tracklistIdForUserLikes(userId);
    userId = parseInt(userId as any, 10);

    this.loadFavoriteTracks(userId, tracklistId);
  }

  loadUserTracks(userId: number|string): void {
    const tracklistId = tracklistIdForUserTracks(userId);
    userId = parseInt(userId as any, 10);

    this.loadTracks(userId, tracklistId);
  }

  loadSearchTracks(query: any, tracklistId: string): void {
    let tracklist = new TracklistRecord() as ITracklist;

    tracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;
    this.tracklistSubject.next(tracklist);

    this.api.fetchSearchResults(query).subscribe(this.tracksFetchedHandler(tracklist));
  }


  private loadFavoriteTracks(userId: any, tracklistId: string): void {
    let tracklist = new TracklistRecord() as ITracklist;

    tracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;
    this.tracklistSubject.next(tracklist);

    this.api.fetchUserLikes(userId).subscribe(this.tracksFetchedHandler(tracklist));
  }

  private loadTracks(userId: any, tracklistId: string): void {
    let tracklist = new TracklistRecord() as ITracklist;

    tracklist = tracklist.merge({id: tracklistId, isPending: true}) as ITracklist;
    this.tracklistSubject.next(tracklist);

    this.api.fetchUserTracks(userId).subscribe(this.tracksFetchedHandler(tracklist));
  }

  private tracksFetchedHandler(tracklist: ITracklist): Subscriber<IPaginatedData> {
    return Subscriber.create((data: IPaginatedData) => {
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
