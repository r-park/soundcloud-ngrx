import { ReflectiveInjector } from '@angular/core';
import { provideStore, Store } from '@ngrx/store';
import { TracklistActions } from 'src/core/tracklists';
import { testUtils } from 'src/core/utils/test';
import { getTracks } from '../selectors';
import { tracksReducer } from '../tracks-reducer';


describe('tracks', () => {
  describe('selectors', () => {
    let actions: TracklistActions;
    let store: Store<any>;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        provideStore({tracks: tracksReducer}),
        TracklistActions
      ]);

      actions = injector.get(TracklistActions);
      store = injector.get(Store);
    });


    describe('getTracks()', () => {
      it('should return observable that emits TracksState', () => {
        let count = 0;
        let tracks = null;

        store
          .let(getTracks())
          .subscribe(value => {
            count++;
            tracks = value;
          });

        // auto-emitting initial value
        expect(count).toBe(1);
        expect(tracks.size).toBe(0);

        // fetch tracks returning empty collection should not emit
        store.dispatch(actions.fetchTracksFulfilled({collection: []}, 'tracklist/1'));
        expect(count).toBe(1);

        // load track
        store.dispatch(actions.fetchTracksFulfilled({collection: [testUtils.createTrack()]}, 'tracklist/1'));
        expect(count).toBe(2);
        expect(tracks.size).toBe(1);

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(2);
      });
    });
  });
});
