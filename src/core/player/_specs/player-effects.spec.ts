import { ReflectiveInjector } from '@angular/core';
import { MOCK_EFFECTS_PROVIDERS, MockStateUpdates } from '@ngrx/effects/testing';
import { List, Map } from 'immutable';
import { PLAYER_STORAGE_KEY } from 'src/core/constants';
import { TracklistRecord } from 'src/core/tracklists';
import { TrackRecord } from 'src/core/tracks';
import { PlayerActions } from '../player-actions';
import { PlayerEffects } from '../player-effects';
import { PlayerStateRecord } from '../player-state';


describe('player', () => {
  describe('PlayerEffects', () => {
    let actions: PlayerActions;
    let effects: PlayerEffects;
    let state: any;
    let updates$: MockStateUpdates;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        MOCK_EFFECTS_PROVIDERS,
        PlayerActions,
        PlayerEffects
      ]);

      actions = new PlayerActions();
      effects = injector.get(PlayerEffects);
      updates$ = injector.get(MockStateUpdates);

      state = {
        tracklists: Map({
          'tracklist/1': new TracklistRecord({id: 'tracklist/1', trackIds: List([1, 2])})
        }),
        tracks: Map()
          .set(1, new TrackRecord({id: 1}))
          .set(2, new TrackRecord({id: 2}))
      };
    });


    describe('audioEnded$', () => {
      it('should dispatch PLAY_SELECTED_TRACK action if tracklist has next track', () => {
        state.player = new PlayerStateRecord({
          trackId: 1,
          tracklistId: 'tracklist/1'
        });

        updates$.send(state, actions.audioEnded());

        effects.audioEnded$.subscribe(action => {
          expect(action).toEqual(actions.playSelectedTrack(2));
        });
      });

      it('should NOT dispatch PLAY_SELECTED_TRACK action if tracklist does not have next track', () => {
        let result;

        state.player = new PlayerStateRecord({
          trackId: 2,
          tracklistId: 'tracklist/1'
        });

        updates$.send(state, actions.audioEnded());
        effects.audioEnded$.subscribe(action => result = action);

        expect(result).not.toBeDefined();
      });
    });


    describe('audioVolumeChanged$', () => {
      it('should save volume to localStorage', () => {
        localStorage.removeItem(PLAYER_STORAGE_KEY);

        effects.audioVolumeChanged$.subscribe();
        updates$.send(state, actions.audioVolumeChanged(50));

        expect(localStorage.getItem(PLAYER_STORAGE_KEY)).toEqual(
          JSON.stringify({volume: 50})
        );

        localStorage.removeItem(PLAYER_STORAGE_KEY);
      });
    });
  });
});
