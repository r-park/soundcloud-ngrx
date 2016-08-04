/* tslint:disable no-empty */
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { ReflectiveInjector } from '@angular/core';
import { MOCK_EFFECTS_PROVIDERS, MockStateUpdates } from '@ngrx/effects/testing';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'src/core/api';
import { TracklistRecord } from '../tracklist';
import { TracklistActions } from '../tracklist-actions';
import { TracklistEffects } from '../tracklist-effects';


describe('tracklists', () => {
  describe('TracklistEffects', () => {
    let actions: TracklistActions;
    let api: ApiService;
    let data: any;
    let effects: TracklistEffects;
    let state: any;
    let updates$: MockStateUpdates;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        MOCK_EFFECTS_PROVIDERS,
        TracklistActions,
        TracklistEffects,
        {provide: ApiService, useValue: {
          fetch(): any {}
        }}
      ]);

      actions = injector.get(TracklistActions);
      api = injector.get(ApiService);
      data = {collection: []};
      effects = injector.get(TracklistEffects);
      updates$ = injector.get(MockStateUpdates);

      state = {
        tracklists: Map({
          currentTracklistId: 'tracklist/1',
          'tracklist/1': new TracklistRecord({id: 'tracklist/1', isPending: true, nextUrl: 'http://next/2'}),
          'tracklist/2': new TracklistRecord({id: 'tracklist/2', isPending: false})
        })
      };
    });


    describe('loadNextTracks$', () => {
      it('should call api.fetch if tracklist.isPending is true', () => {
        spyOn(api, 'fetch').and.returnValue(Observable.of(data));

        effects.loadNextTracks$.subscribe();
        updates$.send(state, actions.loadNextTracks());

        expect(api.fetch).toHaveBeenCalledTimes(1);
        expect(api.fetch).toHaveBeenCalledWith('http://next/2');
      });

      it('should NOT call api.fetch if tracklist.isPending is false', () => {
        spyOn(api, 'fetch').and.returnValue(Observable.of(data));

        state.tracklists = state.tracklists.set('currentTracklistId', 'tracklist/2');
        effects.loadNextTracks$.subscribe();
        updates$.send(state, actions.loadNextTracks());

        expect(api.fetch).not.toHaveBeenCalled();
      });

      it('should dispatch FETCH_TRACKS_FULFILLED after successful API request', () => {
        spyOn(api, 'fetch').and.returnValue(Observable.of(data));

        updates$.send(state, actions.loadNextTracks());

        effects.loadNextTracks$.subscribe(action => {
          expect(action).toEqual(actions.fetchTracksFulfilled(data, 'tracklist/1'));
        });
      });

      it('should dispatch FETCH_TRACKS_FAILED after unsuccessful API request', () => {
        let error = {};
        spyOn(api, 'fetch').and.returnValue(Observable.throw(error));

        updates$.send(state, actions.loadNextTracks());

        effects.loadNextTracks$.subscribe(action => {
          expect(action).toEqual(actions.fetchTracksFailed(error));
        });
      });
    });
  });
});
