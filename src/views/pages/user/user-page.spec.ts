import { Component } from '@angular/core';
import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { RouteParams } from '@ngrx/router';
import { Subject } from 'rxjs/Subject';
import { UserService } from 'src/core/users';
import { TracklistComponent } from '../../components/tracklist';
import { UserCardComponent } from '../../components/user-card';
import { UserPageComponent } from './user-page';


@Component({
  selector: 'tracklist',
  template: ''
})
class TracklistComponentStub {}

@Component({
  selector: 'user-card',
  template: ''
})
class UserCardComponentStub {}


describe('components', () => {
  describe('UserPageComponent', () => {
    let builder;
    let routeParams;
    let user;

    beforeEach(() => {
      let userService = jasmine.createSpyObj('search', ['loadResource', 'loadUser']);
      userService.currentUser$ = new Subject<any>();

      addProviders([
        {provide: RouteParams, useValue: new Subject<any>()},
        {provide: UserService, useValue: userService}
      ]);

      inject([TestComponentBuilder, RouteParams, UserService], (tcb, _routeParams, _user) => {
        builder = tcb;
        routeParams = _routeParams;
        user = _user;
      })();
    });

    it('should initialize properties', () => {
      builder
        .overrideDirective(UserPageComponent, TracklistComponent, TracklistComponentStub)
        .overrideDirective(UserPageComponent, UserCardComponent, UserCardComponentStub)
        .createAsync(UserPageComponent)
        .then(fixture => {
          expect(fixture.componentInstance.resource).not.toBeDefined();
          expect(fixture.componentInstance.ngOnDestroy$ instanceof Subject).toBe(true);
        });
    });

    it('should load user resource using route params', () => {
      builder
        .overrideDirective(UserPageComponent, TracklistComponent, TracklistComponentStub)
        .overrideDirective(UserPageComponent, UserCardComponent, UserCardComponentStub)
        .createAsync(UserPageComponent)
        .then(fixture => {
          fixture.detectChanges();

          routeParams.next({id: '123', resource: 'tracks'});

          fixture.detectChanges();

          expect(user.loadResource).toHaveBeenCalledTimes(1);
          expect(user.loadResource).toHaveBeenCalledWith('123', 'tracks');
        });
    });

    it('should load user using route params', () => {
      builder
        .overrideDirective(UserPageComponent, TracklistComponent, TracklistComponentStub)
        .overrideDirective(UserPageComponent, UserCardComponent, UserCardComponentStub)
        .createAsync(UserPageComponent)
        .then(fixture => {
          fixture.detectChanges();

          routeParams.next({id: '123', resource: 'tracks'});

          fixture.detectChanges();

          expect(user.loadUser).toHaveBeenCalledTimes(1);
          expect(user.loadUser).toHaveBeenCalledWith('123');
        });
    });

    it('should set `resource` property using route params', () => {
      builder
        .overrideDirective(UserPageComponent, TracklistComponent, TracklistComponentStub)
        .overrideDirective(UserPageComponent, UserCardComponent, UserCardComponentStub)
        .createAsync(UserPageComponent)
        .then(fixture => {
          fixture.detectChanges();

          routeParams.next({id: '123', resource: 'tracks'});

          fixture.detectChanges();

          expect(fixture.componentInstance.resource).toBe('tracks');
        });
    });
  });
});
