import { Component } from '@angular/core';
import { ComponentFixture, inject, TestComponentBuilder } from '@angular/core/testing';
import { PlayerComponent } from '../components/player';
import { AppHeaderComponent } from '../components/app-header';
import { AppComponent } from './app';


@Component({
  selector: 'player',
  template: ''
})
class PlayerComponentStub {}

@Component({
  selector: 'app-header',
  template: ''
})
class AppHeaderComponentStub {}


describe('components', () => {
  describe('AppComponent', () => {
    let builder: TestComponentBuilder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });


    function buildComponent(): Promise<ComponentFixture<AppComponent>> {
      return builder
        .overrideDirective(AppComponent, AppHeaderComponent, AppHeaderComponentStub)
        .overrideDirective(AppComponent, PlayerComponent, PlayerComponentStub)
        .createAsync(AppComponent);
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
