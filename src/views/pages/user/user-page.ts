import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/takeUntil';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteParams } from '@ngrx/router';
import { Subject } from 'rxjs/Subject';
import { UserService } from 'src/core/users';
import { TracklistComponent } from '../../components/tracklist';
import { UserCardComponent } from '../../components/user-card';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    TracklistComponent,
    UserCardComponent
  ],
  selector: 'user',
  template: `
    <section>
      <user-card 
        [resource]="resource"
        [user]="user.currentUser$ | async"></user-card>
  
      <tracklist></tracklist>
    </section>
  `
})

export class UserPageComponent {
  ngOnDestroy$ = new Subject<boolean>();
  resource: string;

  constructor(public params$: RouteParams, public user: UserService) {
    params$
      .takeUntil(this.ngOnDestroy$)
      .do(({id, resource}: {id: string, resource: string}) => {
        user.loadResource(id, resource);
        this.resource = resource;
      })
      .pluck('id')
      .distinctUntilChanged()
      .subscribe((id: string) => user.loadUser(id));
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }
}
