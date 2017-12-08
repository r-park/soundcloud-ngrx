import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { searchReducer } from './state';
import { SearchService } from './search-service';
import { TracklistService } from '../tracklists/tracklist-service';


describe('search', () => {
  describe('SearchService', () => {
    let service: SearchService;
    let mockTracklistService: TracklistService;

    class MockTracklistService {
      // noinspection TsLint
      // noinspection JSUnusedLocalSymbols
      loadSearchTracks(query: string, tracklistId: string): void { }
    }

    beforeEach(() => {
      let injector = TestBed.configureTestingModule({
        imports: [
          StoreModule.provideStore({ search: searchReducer })
        ],
        providers: [
          SearchService,
          { provide: TracklistService, useClass: MockTracklistService }
        ]
      });

      service = injector.get(SearchService);
      mockTracklistService = injector.get(TracklistService);
    });


    describe('query$ observable', () => {
      it('should stream the current query', () => {
        let count = 0;
        let query = null;

        service.query$.subscribe(value => {
          count++;
          query = value;
        });

        // auto-emitting initial value
        expect(count).toBe(1);
        expect(query).toBe(null);

        // query 1
        service.loadSearchResults('query 1');
        expect(count).toBe(2);
        expect(query).toBe('query 1');

        // same query: should not emit
        service.loadSearchResults('query 1');
        expect(count).toBe(2);

        // query 2
        service.loadSearchResults('query 2');
        expect(count).toBe(3);
        expect(query).toBe('query 2');
      });
    });


    describe('loadSearchResults()', () => {
      it('should call loadSearchTracks', () => {
        let query = 'test';

        spyOn(mockTracklistService, 'loadSearchTracks');
        service.loadSearchResults(query);

        expect(mockTracklistService.loadSearchTracks).toHaveBeenCalledTimes(1);
        expect(mockTracklistService.loadSearchTracks).toHaveBeenCalledWith(query, `search/${query}`);
      });

      it('should not call loadSearchTracks if parameter if empty or imvalid', () => {
        spyOn(mockTracklistService, 'loadSearchTracks');
        service.loadSearchResults(undefined);
        expect(mockTracklistService.loadSearchTracks).not.toHaveBeenCalled();

        service.loadSearchResults(null);
        expect(mockTracklistService.loadSearchTracks).not.toHaveBeenCalled();

        service.loadSearchResults('');
        expect(mockTracklistService.loadSearchTracks).not.toHaveBeenCalled();
      });
    });
  });
});
