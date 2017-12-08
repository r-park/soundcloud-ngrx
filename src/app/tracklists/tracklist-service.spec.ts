import { TestBed } from '@angular/core/testing';
import { FEATURED_TRACKLIST_ID, FEATURED_TRACKLIST_USER_ID, TRACKS_PER_PAGE } from 'app/app-config';
import { testUtils } from 'app/utils/test';
import { TracklistRecord } from './models';
import { TracklistService } from './tracklist-service';
import { ApiService } from '../core/services/api/api-service';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { is, List } from 'immutable';
import 'rxjs/add/observable/of';


describe('tracklists', () => {
  describe('TracklistService', () => {
    let service: TracklistService;
    let apiService: ApiService;


    beforeEach(() => {
      let injector = TestBed.configureTestingModule({
        providers: [
          TracklistService,
          ApiService,
          BaseRequestOptions,
          MockBackend,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions): Http => {
              return new Http(backend, options);
            }
          }
        ]
      });

      service = injector.get(TracklistService);
      apiService = injector.get(ApiService);
    });

    describe('loadFeaturedTracks', () => {
      it('should emit expected tracklist values', () => {
        let tracks = testUtils.createTracks(1);
        let tracklist = null;

        service.tracklist$.subscribe(value => {
          tracklist = value;
          tracklist.set('isPending', true);
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of({ collection: tracks }));
        service.loadFeaturedTracks();

        expect(apiService.fetchUserLikes).toHaveBeenCalledWith(FEATURED_TRACKLIST_USER_ID);

        let expectedTracklist = new TracklistRecord();
        expectedTracklist = expectedTracklist.merge({
          id: FEATURED_TRACKLIST_ID,
          currentPage: 1,
          hasNextPage: false,
          hasNextPageInStore: false,
          isNew: false,
          isPending: false,
          pageCount: 1,
          trackIds: List([tracks[0].id])
        });

        expect(is(tracklist, expectedTracklist)).toBe(true);
      });

      it('should update tracking of next page', () => {
        let tracklist = null;
        let pageCount = 2;
        let trackCount = TRACKS_PER_PAGE * pageCount;
        let data = { collection: testUtils.createTracks(trackCount) };

        service.tracklist$.subscribe(value => {
          tracklist = value;
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of(data));
        service.loadFeaturedTracks();

        expect(tracklist.currentPage).toBe(1);
        expect(tracklist.pageCount).toBe(2);
        expect(tracklist.hasNextPage).toBe(true);
        expect(tracklist.hasNextPageInStore).toBe(true);
      });

      it('should emit expected track values', () => {
        let expectedTracks = testUtils.createTracks(1);
        let tracks = null;

        service.tracks$.subscribe(value => {
          tracks = value;
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of({ collection: expectedTracks }));

        service.loadFeaturedTracks();

        expect(tracks.toJS()[0].id).toEqual(expectedTracks[0].id);
      });
    });

    describe('loadNextTracks', () => {
      it('should update tracking of next page in store', () => {
        let tracklist = null;
        let pageCount = 2;
        let trackCount = TRACKS_PER_PAGE * pageCount;
        let data = { collection: testUtils.createTracks(trackCount) };

        service.tracklist$.subscribe(value => {
          tracklist = value;
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of(data));
        service.loadFeaturedTracks();

        service.loadNextTracks();

        expect(tracklist.currentPage).toBe(2);
        expect(tracklist.pageCount).toBe(2);
        expect(tracklist.hasNextPage).toBe(false);
        expect(tracklist.hasNextPageInStore).toBe(false);
      });

      it('should fetch new tracks when it has next page but the page is not in store', () => {
        let tracklist = null;
        let pageCount = 2;
        let trackCount = TRACKS_PER_PAGE * pageCount;
        let tracks = testUtils.createTracks(trackCount);

        let data = { collection: tracks.slice(0, TRACKS_PER_PAGE), next_href: 'https://next/2' };
        let data2 = { collection: tracks.slice(TRACKS_PER_PAGE, trackCount) };

        service.tracklist$.subscribe(value => {
          tracklist = value;
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of(data));
        service.loadFeaturedTracks();

        expect(tracklist.currentPage).toBe(1);
        expect(tracklist.pageCount).toBe(1);
        expect(tracklist.hasNextPage).toBe(true);
        expect(tracklist.nextUrl).toBe('https://next/2');
        expect(tracklist.hasNextPageInStore).toBe(false);

        spyOn(apiService, 'fetch').and.returnValue(Observable.of(data2));

        service.loadNextTracks();

        expect(tracklist.currentPage).toBe(2);
        expect(tracklist.pageCount).toBe(2);
        expect(tracklist.hasNextPage).toBe(false);
        expect(tracklist.hasNextPageInStore).toBe(false);
      });

      it('should emit expected number of tracks', () => {
        let trackData = testUtils.createTracks(TRACKS_PER_PAGE * 2 + 1);
        let tracks = null;

        service.tracks$.subscribe(value => {
          tracks = value;
        });

        expect(tracks.size).toEqual(0);

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of({ collection: trackData }));
        service.loadFeaturedTracks();

        expect(tracks.size).toEqual(TRACKS_PER_PAGE);

        service.loadNextTracks();

        expect(tracks.size).toEqual(TRACKS_PER_PAGE * 2);
      });

      it('should emit unique tracks', () => {
        let tracks = null;
        let pageCount = 1;
        let trackCount = TRACKS_PER_PAGE * pageCount;
        let testTracks = testUtils.createTracks(trackCount);

        let data = { collection: testTracks, next_href: 'https://next/2' };
        let data2 = { collection: testTracks };

        service.tracks$.subscribe(value => {
          tracks = value;
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of(data));
        service.loadFeaturedTracks();

        expect(tracks.size).toEqual(TRACKS_PER_PAGE);

        spyOn(apiService, 'fetch').and.returnValue(Observable.of(data2));
        service.loadNextTracks();

        expect(tracks.size).toEqual(TRACKS_PER_PAGE);
      });
    });
  });
});
