import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { FEATURED_TRACKLIST_ID, FEATURED_TRACKLIST_USER_ID, TRACKS_PER_PAGE } from 'app/app-config';
import { testUtils } from 'app/utils/test';
import { TracklistRecord } from './models';
import { initialState, tracklistsReducer } from './state/tracklists-reducer';
import { tracksReducer } from './state/tracks-reducer';
import { TracklistActions } from './tracklist-actions';
import { TracklistService } from './tracklist-service';
import { ApiService } from '../core/services/api/api-service';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';


describe('tracklists', () => {
  describe('TracklistService', () => {
    let service: TracklistService;
    let apiService: ApiService;


    beforeEach(() => {
      let injector = TestBed.configureTestingModule({
        imports: [
          StoreModule.provideStore(
            {
              tracklists: tracklistsReducer,
              tracks: tracksReducer
            },
            {
              tracklists: initialState
                .set('tracklist/1', new TracklistRecord({id: 'tracklist/1'}))
                .set('tracklist/2', new TracklistRecord({id: 'tracklist/2'}))
            }
          )
        ],
        providers: [
          TracklistActions,
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


    describe('tracklist$ observable', () => {
      it('should emit the current tracklist from store', () => {
        let count = 0;
        let tracks = testUtils.createTracks(2);
        let tracklist = null;

        service.tracklist$.subscribe(value => {
          count++;
          tracklist = value;
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of({collection: [tracks[0]]}));
        service.loadFeaturedTracks();

        expect(apiService.fetchUserLikes).toHaveBeenCalledWith(FEATURED_TRACKLIST_USER_ID);

        expect(count).toBe(3);
        expect(tracklist.id).toBe(FEATURED_TRACKLIST_ID);
        expect(tracklist.nextUrl).toBeNull();
        expect(tracklist.trackIds.toJS()).toEqual([tracks[0].id]);
      });
    });


    describe('tracks$ observable', () => {
      it('should emit the list of tracks for current tracklist', () => {
        let count = 0;
        let trackData = testUtils.createTracks(TRACKS_PER_PAGE * 2 + 1);
        let tracks = null;

        service.tracks$.subscribe(value => {
          count++;
          tracks = value;
        });

        spyOn(apiService, 'fetchUserLikes').and.returnValue(Observable.of({collection: trackData}));
        service.loadFeaturedTracks();

        expect(count).toBe(3);

        // load two pages of tracks into tracklist; should emit first page of tracks
        expect(tracks.size).toEqual(TRACKS_PER_PAGE);

        // go to page two; should emit first and second page of tracks
        service.loadNextTracks();

        expect(count).toBe(4);

        expect(tracks.size).toEqual(TRACKS_PER_PAGE * 2);

      });
    });
  });
});
