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
    this.userSubject = new ReplaySubject<IUser>(1);
    this.currentUser$ = this.userSubject.asObservable();
  }

  loadUser(userId: number|string): void {
    userId = parseInt(userId as any, 10);
    this.api.fetchUser(userId).subscribe(data => this.userSubject.next(createUser(data, true)));
  }
}
