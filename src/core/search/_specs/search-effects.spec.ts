/* tslint:disable no-empty */
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { ReflectiveInjector } from '@angular/core';
import { MOCK_EFFECTS_PROVIDERS, MockStateUpdates } from '@ngrx/effects/testing';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'src/core/api';
import { TracklistActions, TracklistRecord } from 'src/core/tracklists';
import { SearchActions } from '../search-actions';
import { SearchEffects } from '../search-effects';


describe('search', () => {
  describe('SearchEffects', () => {
    let api: ApiService;
    let data: any;
    let effects: SearchEffects;
    let query: string;
    let searchActions: SearchActions;
    let state: any;
    let tracklistActions: TracklistActions;
    let updates$: MockStateUpdates;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        MOCK_EFFECTS_PROVIDERS,
        {provide: ApiService, useValue: {
          fetchSearchResults(): any {}
        }},
        SearchEffects,
        TracklistActions
      ]);

      api = injector.get(ApiService);
      data = {collection: []};
      effects = injector.get(SearchEffects);
      query = 'query';
      searchActions = new SearchActions();
      tracklistActions = new TracklistActions();
      updates$ = injector.get(MockStateUpdates);

      state = {
        tracklists: Map({
          currentTracklistId: 'search/foo',
          'search/foo': new TracklistRecord({id: 'search/foo', isNew: true}),
          'search/bar': new TracklistRecord({id: 'search/bar', isNew: false})
        })
      };
    });


    describe('loadSearchResults$', () => {
      it('should call api.fetchSearchResults if tracklist.isNew is true', () => {
        spyOn(api, 'fetchSearchResults').and.returnValue(Observable.of(data));

        effects.loadSearchResults$.subscribe();
        updates$.send(state, searchActions.loadSearchResults('foo'));

        expect(api.fetchSearchResults).toHaveBeenCalledTimes(1);
        expect(api.fetchSearchResults).toHaveBeenCalledWith('foo');
      });

      it('should NOT call api.fetchSearchResults if tracklist.isNew is false', () => {
        spyOn(api, 'fetchSearchResults').and.returnValue(Observable.of(data));

        state.tracklists = state.tracklists.set('currentTracklistId', 'search/bar');
        effects.loadSearchResults$.subscribe();
        updates$.send(state, searchActions.loadSearchResults('bar'));

        expect(api.fetchSearchResults).not.toHaveBeenCalled();
      });

      it('should dispatch FETCH_TRACKS_FULFILLED after successful API request', () => {
        spyOn(api, 'fetchSearchResults').and.returnValue(Observable.of(data));

        updates$.send(state, searchActions.loadSearchResults('foo'));

        effects.loadSearchResults$.subscribe(action => {
          expect(action).toEqual(tracklistActions.fetchTracksFulfilled(data, 'search/foo'));
        });
      });

      it('should dispatch FETCH_TRACKS_FAILED after unsuccessful API request', () => {
        let error = {};
        spyOn(api, 'fetchSearchResults').and.returnValue(Observable.throw(error));

        updates$.send(state, searchActions.loadSearchResults('foo'));

        effects.loadSearchResults$.subscribe(action => {
          expect(action).toEqual(tracklistActions.fetchTracksFailed(error));
        });
      });
    });
  });
});
