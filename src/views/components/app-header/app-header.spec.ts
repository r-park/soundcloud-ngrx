import { Component } from '@angular/core';
import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { provideRouter, Router } from '@ngrx/router';
import { SearchBarComponent } from '../search-bar';
import { AppHeaderComponent } from './app-header';


@Component({
  selector: 'search-bar',
  template: ''
})
class SearchBarComponentStub {}

@Component({
  selector: 'test-page',
  template: ''
})
class TestPage {}


describe('components', () => {
  describe('AppHeaderComponent', () => {
    let builder;
    let router;

    beforeEach(() => {
      addProviders([
        provideRouter([{path: '/', component: TestPage}]),
        {provide: APP_BASE_HREF, useValue: '/'}
      ]);

      inject([TestComponentBuilder, Router], (tcb, _router) => {
        builder = tcb;
        router = _router;
      })();
    });


    it('should have a title', () => {
      builder
        .overrideDirective(AppHeaderComponent, SearchBarComponent, SearchBarComponentStub)
        .createAsync(AppHeaderComponent)
        .then(fixture => {
          let h1 = fixture.nativeElement.querySelector('h1');
          expect(h1.textContent).toBe('SoundCloud • Angular2 NgRx');
        });
    });

    it('should initialize property `open` to be false', () => {
      builder
        .overrideDirective(AppHeaderComponent, SearchBarComponent, SearchBarComponentStub)
        .createAsync(AppHeaderComponent)
        .then(fixture => {
          expect(fixture.componentInstance.open).toBe(false);
        });
    });

    it('should toggle property `open` on route change if value is true', () => {
      builder
        .overrideDirective(AppHeaderComponent, SearchBarComponent, SearchBarComponentStub)
        .createAsync(AppHeaderComponent)
        .then(fixture => {
          fixture.componentInstance.open = true;
          fixture.detectChanges();

          expect(fixture.componentInstance.open).toBe(true);

          router.next({path: '/foo', type: 'push'});
          fixture.detectChanges();

          expect(fixture.componentInstance.open).toBe(false);

          router.next({path: '/bar', type: 'push'});
          fixture.detectChanges();

          // should not change since previous value was false
          expect(fixture.componentInstance.open).toBe(false);
        });
    });


    describe('toggleOpen()', () => {
      it('should toggle property `open`', () => {
        builder
          .overrideDirective(AppHeaderComponent, SearchBarComponent, SearchBarComponentStub)
          .createAsync(AppHeaderComponent)
          .then(fixture => {
            expect(fixture.componentInstance.open).toBe(false);

            fixture.componentInstance.toggleOpen();
            fixture.detectChanges();

            expect(fixture.componentInstance.open).toBe(true);

            fixture.componentInstance.toggleOpen();
            fixture.detectChanges();

            expect(fixture.componentInstance.open).toBe(false);
          });
      });
    });


    describe('search button', () => {
      it('should toggle property `open` on click', () => {
        builder
          .overrideDirective(AppHeaderComponent, SearchBarComponent, SearchBarComponentStub)
          .createAsync(AppHeaderComponent)
          .then(fixture => {
            fixture.detectChanges();

            expect(fixture.componentInstance.open).toBe(false);

            let searchButton = fixture.nativeElement.querySelector('.btn--search-alt');
            searchButton.click();
            fixture.detectChanges();

            expect(fixture.componentInstance.open).toBe(true);

            searchButton.click();
            fixture.detectChanges();

            expect(fixture.componentInstance.open).toBe(false);
          });
      });
    });
  });
});
