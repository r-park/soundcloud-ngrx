import { Component, Input } from '@angular/core';
import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { TracklistService } from 'src/core/tracklists';
import { TracklistComponent } from '../../components/tracklist';
import { HomePageComponent } from './home-page';


@Component({
  selector: 'tracklist',
  template: ''
})
class TracklistComponentStub {
  @Input() layout: string;
}


describe('components', () => {
  describe('HomePageComponent', () => {
    let builder;
    let tracklist;

    beforeEach(() => {
      addProviders([
        {provide: TracklistService, useValue: jasmine.createSpyObj('tracklist', ['loadFeaturedTracks'])}
      ]);

      inject([TestComponentBuilder, TracklistService], (tcb, _tracklist) => {
        builder = tcb;
        tracklist = _tracklist;
      })();
    });

    it('should initialize properties', () => {
      builder
        .overrideDirective(HomePageComponent, TracklistComponent, TracklistComponentStub)
        .createAsync(HomePageComponent)
        .then(fixture => {
          expect(fixture.componentInstance.layout).toBe('compact');
          expect(fixture.componentInstance.section).toBe('Spotlight');
          expect(fixture.componentInstance.title).toBe('Featured Tracks');
        });
    });

    it('should load featured tracks', () => {
      builder
        .overrideDirective(HomePageComponent, TracklistComponent, TracklistComponentStub)
        .createAsync(HomePageComponent)
        .then(() => {
          expect(tracklist.loadFeaturedTracks).toHaveBeenCalledTimes(1);
        });
    });

    it('should display current section and title', () => {
      builder
        .overrideDirective(HomePageComponent, TracklistComponent, TracklistComponentStub)
        .createAsync(HomePageComponent)
        .then(fixture => {
          fixture.detectChanges();

          let compiled = fixture.nativeElement;

          expect(compiled.querySelector('.content-header__section').textContent).toBe('Spotlight /');
          expect(compiled.querySelector('.content-header__title').textContent).toBe('Featured Tracks');
        });
    });
  });
});
