import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { createUser, IUser } from './models';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ApiService } from '../core/services/api';


@Injectable()
export class UserService {
  currentUser$: Observable<IUser>;
  private userSubject: ReplaySubject<IUser>;

  constructor(private api: ApiService) {
    this.userSubject = new ReplaySubject<IUser>(1);
    this.currentUser$ = this.userSubject.asObservable();
  }

  loadUser(userId: number | string): void {
    userId = parseInt(userId as any, 10);
    this.api.fetchUser(userId).subscribe(data => this.userSubject.next(createUser(data, true)));
  }
}
