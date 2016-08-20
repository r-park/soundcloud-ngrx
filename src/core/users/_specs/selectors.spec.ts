import { ReflectiveInjector } from '@angular/core';
import { provideStore, Store } from '@ngrx/store';
import { TracklistActions } from 'src/core/tracklists';
import { testUtils } from 'src/core/utils/test';
import { getCurrentUser, getUsers } from '../selectors';
import { createUser } from '../user';
import { UserActions } from '../user-actions';
import { initialState, usersReducer } from '../users-reducer';


describe('users', () => {
  describe('selectors', () => {
    let actions: UserActions;
    let store: Store<any>;
    let tracklistActions: TracklistActions;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        UserActions,
        provideStore(
          {
            users: usersReducer
          },
          {
            users: initialState
              .set(123, createUser(testUtils.createUser(123)))
              .set(456, createUser(testUtils.createUser(456)))
          }
        )
      ]);

      actions = injector.get(UserActions);
      store = injector.get(Store);
      tracklistActions = new TracklistActions();
    });


    describe('getCurrentUser()', () => {
      it('should return observable that emits current user from UsersState', () => {
        let count = 0;
        let user = null;

        store
          .let(getCurrentUser())
          .subscribe(value => {
            count++;
            user = value;
          });

        // auto-emitting initial value
        expect(count).toBe(1);
        expect(user).not.toBeDefined();

        // load user
        store.dispatch(actions.loadUser(123));
        expect(count).toBe(2);
        expect(user.id).toBe(123);

        // loading same user should not emit
        store.dispatch(actions.loadUser(123));
        expect(count).toBe(2);

        // load different user
        store.dispatch(actions.loadUser(456));
        expect(count).toBe(3);
        expect(user.id).toBe(456);

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(3);
      });
    });


    describe('getUsers()', () => {
      it('should return observable that emits UsersState', () => {
        let count = 0;
        let track = testUtils.createTrack();
        let user = testUtils.createUser(track.user.id);
        let users = null;

        store
          .let(getUsers())
          .subscribe(value => {
            count++;
            users = value;
          });

        // auto-emitting initial value
        expect(count).toBe(1);
        expect(users.size).toBe(3);

        // fetching basic user data from track.user
        store.dispatch(tracklistActions.fetchTracksFulfilled({collection: [track]}, '@tracklist/1'));
        expect(count).toBe(2);
        expect(users.size).toBe(4);

        // fetching user profile with same id as track.user
        store.dispatch(actions.fetchUserFulfilled(user));
        expect(count).toBe(3);
        expect(users.size).toBe(4);

        // fetching same user profile should not emit
        store.dispatch(actions.fetchUserFulfilled(user));
        expect(count).toBe(3);

        // dispatching unrelated action should not emit
        store.dispatch({type: 'UNDEFINED'});
        expect(count).toBe(3);
      });
    });
  });
});
