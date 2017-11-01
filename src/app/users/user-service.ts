import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IAppState } from 'app';
import { IUser } from './models';
import { UserActions } from './user-actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ApiService } from '../core/services/api/api-service';
import { createUser } from './models/user';


@Injectable()
export class UserService {
  currentUser$: Observable<IUser>;
  private userSubject: ReplaySubject<IUser>;

  constructor(private actions: UserActions, private store$: Store<IAppState>, private api: ApiService) {
    // this.currentUser$ = store$.let(getCurrentUser());
    this.userSubject = new ReplaySubject<IUser>(1);
    this.currentUser$ = this.userSubject.asObservable();
  }

  //
  // loadResource(userId: number|string, resource: string): void {
  //   switch (resource) {
  //     case 'likes':
  //       this.loadUserLikes(userId);
  //       break;
  //
  //     case 'tracks':
  //       this.loadUserTracks(userId);
  //       break;
  //   }
  // }

  loadUser(userId: number|string): void {
    // this.store$.dispatch(
    //   this.actions.loadUser(userId)
    // );

    // triggers

    // case UserActions.LOAD_USER:
    //   return state.set('currentUserId', payload.userId);

    // +++

    // loadUser$ = this.actions$
    //   .ofType(UserActions.LOAD_USER)
    //   .withLatestFrom(this.store$.let(getCurrentUser()), (action, user) => ({
    //     payload: action.payload,
    //     user
    //   }))
    //   .filter(({user}) => !user || !user.profile)
    //   .switchMap(({payload}) => this.api.fetchUser(payload.userId)
    //     .map(data => this.userActions.fetchUserFulfilled(data))
    //     .catch(error => Observable.of(this.userActions.fetchUserFailed(error)))
    //   );

    // +++

    // return state.withMutations(users => {
    //   const { user } = payload;
    //   if (!users.has(user.id) || !users.get(user.id).profile) {
    //     users.set(user.id, createUser(user, true));
    //   }
    // });

    // now becomes

    userId = parseInt(userId as any, 10);
    this.api.fetchUser(userId).subscribe(data => this.userSubject.next(createUser(data, true)));

  }

  //
  // loadUserLikes(userId: number|string): void {
  //   this.store$.dispatch(
  //     this.actions.loadUserLikes(userId)
  //   );
  // }
  //
  // loadUserTracks(userId: number|string): void {
  //   this.store$.dispatch(
  //     this.actions.loadUserTracks(userId)
  //   );
  // }
}
