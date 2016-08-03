import { inject, TestComponentBuilder } from '@angular/core/testing';
import { App } from './app';


describe('views', () => {
  describe('App', () => {
    let builder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should have a `route-view`', () => {
      builder
        .createAsync(App)
        .then(fixture => {
          fixture.detectChanges();
          let routeView = fixture.nativeElement.querySelector('route-view');
          expect(routeView).not.toEqual(null);
        });
    });
  });
});
