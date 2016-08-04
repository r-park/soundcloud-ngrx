import { Component } from '@angular/core';
import { inject, TestComponentBuilder } from '@angular/core/testing';
import { SearchFormComponent } from '../components/search-form';
import { App } from './app';


@Component({
  selector: 'search-form',
  template: ''
})
class SearchFormComponentStub {}


describe('views', () => {
  describe('App', () => {
    let builder: TestComponentBuilder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should have a `route-view`', () => {
      builder
        .overrideDirective(App, SearchFormComponent, SearchFormComponentStub)
        .createAsync(App)
        .then(fixture => {
          fixture.detectChanges();
          let routeView = fixture.nativeElement.querySelector('route-view');
          expect(routeView).not.toEqual(null);
        });
    });
  });
});
