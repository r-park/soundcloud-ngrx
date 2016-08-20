/* tslint:disable no-empty */
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { ReflectiveInjector } from '@angular/core';
import { MOCK_EFFECTS_PROVIDERS, MockStateUpdates } from '@ngrx/effects/testing';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { ApiService } from 'src/core/api';
import { TracklistActions, TracklistRecord } from 'src/core/tracklists';
import { UserRecord } from '../user';
import { UserActions } from '../user-actions';
import { UserEffects } from '../user-effects';


class ApiServiceStub {
  fetchUser(): any {}
  fetchUserLikes(): any {}
  fetchUserTracks(): any {}
}


describe('users', () => {
  describe('UserEffects', () => {
    let api: ApiService;
    let effects: UserEffects;
    let state: any;
    let tracklistActions: TracklistActions;
    let updates$: MockStateUpdates;
    let userActions: UserActions;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        MOCK_EFFECTS_PROVIDERS,
        TracklistActions,
        UserActions,
        UserEffects,
        {provide: ApiService, useFactory: () => new ApiServiceStub()}
      ]);

      api = injector.get(ApiService);
      effects = injector.get(UserEffects);
      tracklistActions = injector.get(TracklistActions);
      updates$ = injector.get(MockStateUpdates);
      userActions = injector.get(UserActions);

      state = {
        tracklists: Map({
          currentTracklistId: 'tracklist/1',
          'tracklist/1': new TracklistRecord({id: 'tracklist/1', isNew: true}),
          'tracklist/2': new TracklistRecord({id: 'tracklist/2', isNew: false})
        }),
        users: Map({
          currentUserId: 123,
          123: new UserRecord({id: 123, profile: true}),
          456: new UserRecord({id: 456, profile: false})
        })
      };
    });


    describe('loadUser$', () => {
      let responseData;

      beforeEach(() => {
        responseData = {};
      });

      it('should call api.fetchUser() if user is not in UsersState', () => {
        spyOn(api, 'fetchUser').and.returnValue(Observable.of(responseData));

        state.users = state.users.set('currentUserId', 789);
        effects.loadUser$.subscribe();
        updates$.send(state, userActions.loadUser(789));

        expect(api.fetchUser).toHaveBeenCalledTimes(1);
        expect(api.fetchUser).toHaveBeenCalledWith(789);
      });

      it('should call api.fetchUser() if user.profile is false', () => {
        spyOn(api, 'fetchUser').and.returnValue(Observable.of(responseData));

        state.users = state.users.set('currentUserId', 456);
        effects.loadUser$.subscribe();
        updates$.send(state, userActions.loadUser(456));

        expect(api.fetchUser).toHaveBeenCalledTimes(1);
        expect(api.fetchUser).toHaveBeenCalledWith(456);
      });

      it('should NOT call api.fetchUser() if user.profile is true', () => {
        spyOn(api, 'fetchUser').and.returnValue(Observable.of(responseData));

        effects.loadUser$.subscribe();
        updates$.send(state, userActions.loadUser(123));

        expect(api.fetchUser).toHaveBeenCalledTimes(1);
        expect(api.fetchUser).toHaveBeenCalledWith(123);
      });

      it('should dispatch FETCH_USER_FULFILLED after successful API request', () => {
        spyOn(api, 'fetchUser').and.returnValue(Observable.of(responseData));

        updates$.send(state, userActions.loadUser(123));

        effects.loadUser$.subscribe(action => {
          expect(action).toEqual(userActions.fetchUserFulfilled(responseData));
        });
      });

      it('should dispatch FETCH_USER_FAILED after unsuccessful API request', () => {
        let error = {};
        spyOn(api, 'fetchUser').and.returnValue(Observable.throw(error));

        updates$.send(state, userActions.loadUser(123));

        effects.loadUser$.subscribe(action => {
          expect(action).toEqual(userActions.fetchUserFailed(error));
        });
      });
    });


    describe('loadUserLikes$', () => {
      let responseData;
      let userId;

      beforeEach(() => {
        responseData = {collection: []};
        userId = 123;
      });

      it('should call api.fetchUserLikes() if tracklist.isNew is true', () => {
        spyOn(api, 'fetchUserLikes').and.returnValue(Observable.of(responseData));

        effects.loadUserLikes$.subscribe();
        updates$.send(state, userActions.loadUserLikes(userId));

        expect(api.fetchUserLikes).toHaveBeenCalledTimes(1);
        expect(api.fetchUserLikes).toHaveBeenCalledWith(userId);
      });

      it('should NOT call api.fetchUserLikes() if tracklist.isNew is false', () => {
        spyOn(api, 'fetchUserLikes').and.returnValue(Observable.of(responseData));

        state.tracklists = state.tracklists.set('currentTracklistId', 'tracklist/2');
        effects.loadUserLikes$.subscribe();
        updates$.send(state, userActions.loadUserLikes(userId));

        expect(api.fetchUserLikes).not.toHaveBeenCalled();
      });

      it('should dispatch FETCH_TRACKS_FULFILLED after successful API request', () => {
        spyOn(api, 'fetchUserLikes').and.returnValue(Observable.of(responseData));

        updates$.send(state, userActions.loadUserLikes(userId));

        effects.loadUserLikes$.subscribe(action => {
          expect(action).toEqual(tracklistActions.fetchTracksFulfilled(responseData, 'users/123/likes'));
        });
      });

      it('should dispatch FETCH_TRACKS_FAILED after unsuccessful API request', () => {
        let error = {};
        spyOn(api, 'fetchUserLikes').and.returnValue(Observable.throw(error));

        updates$.send(state, userActions.loadUserLikes(userId));

        effects.loadUserLikes$.subscribe(action => {
          expect(action).toEqual(tracklistActions.fetchTracksFailed(error));
        });
      });
    });


    describe('loadUserTracks$', () => {
      let responseData;
      let userId;

      beforeEach(() => {
        responseData = {collection: []};
        userId = 123;
      });

      it('should call api.fetchUserTracks() if tracklist.isNew is true', () => {
        spyOn(api, 'fetchUserTracks').and.returnValue(Observable.of(responseData));

        effects.loadUserTracks$.subscribe();
        updates$.send(state, userActions.loadUserTracks(userId));

        expect(api.fetchUserTracks).toHaveBeenCalledTimes(1);
        expect(api.fetchUserTracks).toHaveBeenCalledWith(userId);
      });

      it('should NOT call api.fetchUserTracks() if tracklist.isNew is false', () => {
        spyOn(api, 'fetchUserTracks').and.returnValue(Observable.of(responseData));

        state.tracklists = state.tracklists.set('currentTracklistId', 'tracklist/2');
        effects.loadUserTracks$.subscribe();
        updates$.send(state, userActions.loadUserTracks(userId));

        expect(api.fetchUserTracks).not.toHaveBeenCalled();
      });

      it('should dispatch FETCH_TRACKS_FULFILLED after successful API request', () => {
        spyOn(api, 'fetchUserTracks').and.returnValue(Observable.of(responseData));

        updates$.send(state, userActions.loadUserTracks(userId));

        effects.loadUserTracks$.subscribe(action => {
          expect(action).toEqual(tracklistActions.fetchTracksFulfilled(responseData, 'users/123/tracks'));
        });
      });

      it('should dispatch FETCH_TRACKS_FAILED after unsuccessful API request', () => {
        let error = {};
        spyOn(api, 'fetchUserTracks').and.returnValue(Observable.throw(error));

        updates$.send(state, userActions.loadUserTracks(userId));

        effects.loadUserTracks$.subscribe(action => {
          expect(action).toEqual(tracklistActions.fetchTracksFailed(error));
        });
      });
    });
  });
});
