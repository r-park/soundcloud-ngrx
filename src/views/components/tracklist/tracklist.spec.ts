import { Component, Input } from '@angular/core';
import { addProviders, ComponentFixture, inject, TestComponentBuilder } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlayerService } from 'src/core/player';
import { TracklistService } from 'src/core/tracklists';
import { createTrack } from 'src/core/tracks';
import { testUtils } from 'src/core/utils/test';
import { WaveformComponent } from '../waveform';
import { WaveformTimelineComponent } from '../waveform-timeline';
import { TracklistComponent } from './tracklist';


@Component({
  selector: 'waveform',
  template: ''
})
class WaveformComponentStub {
  @Input() src: string;
}


describe('components', () => {
  describe('TracklistComponent', () => {
    let builder;
    let playerService;
    let tracklistService;
    let tracks;

    beforeEach(() => {
      tracks = [
        createTrack(testUtils.createTrack(1)),
        createTrack(testUtils.createTrack(2))
      ];

      let playerServiceStub = jasmine.createSpyObj('playerService', [
        'pause',
        'play',
        'seek',
        'select'
      ]);

      playerServiceStub.player$ = new BehaviorSubject<any>({
        isPlaying: false,
        trackId: tracks[0].id,
        volume: 10
      });

      playerServiceStub.times$ = new BehaviorSubject<any>({
        bufferedTime: 200,
        duration: 400,
        percentBuffered: '50%',
        percentCompleted: '25%'
      });

      let tracklistServiceStub = {
        tracklist$: new BehaviorSubject<any>({id: 'tracklist/1'}),
        tracks$: new BehaviorSubject<any>(tracks)
      };

      addProviders([
        {provide: PlayerService, useValue: playerServiceStub},
        {provide: TracklistService, useValue: tracklistServiceStub}
      ]);

      inject([TestComponentBuilder, PlayerService, TracklistService],
        (tcb, _playerService, _tracklistService) => {
          builder = tcb;
          playerService = _playerService;
          tracklistService = _tracklistService;
        })();
    });


    function buildComponent(): Promise<ComponentFixture<TracklistComponent>> {
      return builder
        .overrideDirective(WaveformTimelineComponent, WaveformComponent, WaveformComponentStub)
        .createAsync(TracklistComponent);
    }


    it('should render track cards', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let trackCards = fixture.nativeElement.querySelectorAll('.track-card');
          expect(trackCards.length).toBe(2);
        });
    });

    it('should render full-size track cards when media is large', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let el = fixture.nativeElement.querySelector('track-card');
          expect(el.className).toBe('g-col');
        });
    });

    it('should call PlayerService#pause() when pause button is clicked', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          playerService.player$.next({
            isPlaying: true,
            trackId: tracks[0].id,
            volume: 10
          });

          fixture.detectChanges();

          let trackCards = fixture.nativeElement.querySelectorAll('track-card');
          trackCards[0].querySelector('.btn--pause').click();

          expect(playerService.pause).toHaveBeenCalledTimes(1);
        });
    });

    it('should call PlayerService#play() when play button is clicked on selected track', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          let trackCards = fixture.nativeElement.querySelectorAll('track-card');
          trackCards[0].querySelector('.btn--play').click();

          expect(playerService.play).toHaveBeenCalledTimes(1);

          trackCards[1].querySelector('.btn--play').click();

          expect(playerService.play).toHaveBeenCalledTimes(1);
        });
    });

    it('should call PlayerService#select() when play button is clicked on unselected track', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          let trackCards = fixture.nativeElement.querySelectorAll('track-card');
          trackCards[0].querySelector('.btn--play').click();

          expect(playerService.select).not.toHaveBeenCalled();

          trackCards[1].querySelector('.btn--play').click();

          expect(playerService.select).toHaveBeenCalledTimes(1);
        });
    });

    it('should call PlayerService#seek() when audio timeline is clicked (compact mode)', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.layout = 'compact';
          fixture.detectChanges();

          let trackCards = fixture.nativeElement.querySelectorAll('track-card');
          trackCards[0].querySelector('audio-timeline').click();

          expect(playerService.seek).toHaveBeenCalledTimes(1);
          expect(typeof playerService.seek.calls.argsFor(0)[0]).toBe('number');
        });
    });
  });
});
