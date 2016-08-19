import { Component, ViewChild } from '@angular/core';
import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { provideRouter } from '@ngrx/router';
import { UserRecord } from 'src/core/users';
import { UserCardComponent } from './user-card';


@Component({
  directives: [UserCardComponent],
  template: ''
})
class TestComponent {
  @ViewChild(UserCardComponent) userCard: UserCardComponent;
}


describe('components', () => {
  describe('UserCardComponent', () => {
    let builder;

    beforeEach(() => {
      addProviders([
        provideRouter([{path: '/', component: TestComponent}]),
        {provide: APP_BASE_HREF, useValue: '/'}
      ]);

      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should set property `resource` with default value `tracks`', () => {
      builder
        .createAsync(UserCardComponent)
        .then(fixture => {
          expect(fixture.componentInstance.resource).toBe('tracks');
        });
    });

    it('should set property `resource` with provided @Input value', () => {
      builder
        .overrideTemplate(TestComponent, '<user-card [resource]="resource" [user]="user"></user-card>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.resource = 'foo';
          fixture.detectChanges();

          expect(fixture.componentInstance.userCard.resource).toBe('foo');
        });
    });

    it('should set property `user` with provided input value', () => {
      builder
        .overrideTemplate(TestComponent, '<user-card [resource]="resource" [user]="user"></user-card>')
        .createAsync(TestComponent)
        .then(fixture => {
          let user = new UserRecord();

          fixture.componentInstance.user = user;
          fixture.detectChanges();

          expect(fixture.componentInstance.userCard.user).toBe(user);
        });
    });

    it("should display the user's username", () => {
      builder
        .overrideTemplate(TestComponent, '<user-card [resource]="resource" [user]="user"></user-card>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.user = new UserRecord({username: 'goku'});
          fixture.detectChanges();

          expect(fixture.nativeElement.querySelector('h1').textContent).toBe('goku');
        });
    });
  });
});
