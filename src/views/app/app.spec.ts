import { Component } from '@angular/core';
import { ComponentFixture, inject, TestComponentBuilder } from '@angular/core/testing';
import { PlayerComponent } from '../components/player';
import { SearchFormComponent } from '../components/search-form';
import { App } from './app';


@Component({
  selector: 'player',
  template: ''
})
class PlayerComponentStub {}

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


    function buildComponent(): Promise<ComponentFixture<App>> {
      return builder
        .overrideDirective(App, PlayerComponent, PlayerComponentStub)
        .overrideDirective(App, SearchFormComponent, SearchFormComponentStub)
        .createAsync(App);
    }


    it('should have a `route-view`', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let routeView = fixture.nativeElement.querySelector('route-view');
          expect(routeView).not.toEqual(null);
        });
    });

    it('should have a PlayerComponent', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let playerComponent = fixture.nativeElement.querySelector('player');
          expect(playerComponent).not.toEqual(null);
        });
    });
  });
});
