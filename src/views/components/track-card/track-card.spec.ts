import { Component, Input, ViewChild } from '@angular/core';
import { ComponentFixture, inject, TestComponentBuilder } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { createTrack } from 'src/core/tracks';
import { testUtils } from 'src/core/utils/test';
import { WaveformComponent } from '../waveform';
import { WaveformTimelineComponent } from '../waveform-timeline';
import { TrackCardComponent } from './track-card';


@Component({
  directives: [TrackCardComponent],
  template: ''
})
class TestComponent {
  @ViewChild(TrackCardComponent) trackCard: TrackCardComponent;
}

@Component({
  selector: 'waveform',
  template: ''
})
class WaveformComponentStub {
  @Input() src: string;
}


describe('components', () => {
  describe('TrackCardComponent', () => {
    let builder;
    let times;
    let track;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();

      times = new BehaviorSubject<any>({
        bufferedTime: 200,
        duration: 400,
        percentBuffered: '50%',
        percentCompleted: '25%'
      });

      track = createTrack(testUtils.createTrack(1));
    });


    function buildComponent(): Promise<ComponentFixture<TestComponent>> {
      let template = `
        <track-card 
          [compact]="compact"
          [isPlaying]="isPlaying"
          [isSelected]="isSelected"
          [times]="times"
          [track]="track"></track-card>`;

      return builder
        .overrideDirective(WaveformTimelineComponent, WaveformComponent, WaveformComponentStub)
        .overrideTemplate(TestComponent, template)
        .createAsync(TestComponent)
        .then((fixture: ComponentFixture<TestComponent>) => {
          fixture.componentInstance.compact = false;
          fixture.componentInstance.isPlaying = false;
          fixture.componentInstance.isSelected = false;
          fixture.componentInstance.times = times;
          fixture.componentInstance.track = track;
          return fixture;
        });
    }


    it('should display track image', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let el = fixture.nativeElement.querySelector('img');
          expect(el.getAttribute('src')).toBe(track.artworkUrl);
        });
    });

    it('should display track username', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let el = fixture.nativeElement.querySelector('.track-card__username');
          expect(el.textContent).toBe(track.username);
        });
    });

    it('should display track title', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let el = fixture.nativeElement.querySelector('.track-card__title');
          expect(el.textContent).toBe(track.title);
        });
    });

    it('should display track duration', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let el = fixture.nativeElement.querySelector('.meta-duration');

          expect(el.textContent).toBe('04:00');
        });
    });

    it('should display track playback count', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.track = track.set('playbackCount', 1000);
          fixture.detectChanges();
          let el = fixture.nativeElement.querySelector('.meta-playback-count');

          expect(el.textContent).toBe('1,000');
        });
    });

    it('should display track likes count', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.track = track.set('likesCount', 1000);
          fixture.detectChanges();
          let el = fixture.nativeElement.querySelector('.meta-likes-count');

          expect(el.textContent).toBe('1,000');
        });
    });

    it('should emit `seek` event when audio timeline is clicked (compact mode)', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.compact = true;
          fixture.componentInstance.isSelected = true;
          fixture.detectChanges();

          let trackCard = fixture.componentInstance.trackCard;
          spyOn(trackCard.seek, 'emit');

          expect(trackCard.seek.emit).not.toHaveBeenCalled();

          fixture.nativeElement.querySelector('.track-card__timeline audio-timeline').click();

          expect(trackCard.seek.emit).toHaveBeenCalledTimes(1);
          expect(typeof trackCard.seek.emit.calls.argsFor(0)[0]).toBe('number');
        });
    });

    it('should emit `seek` event when waveform timeline is clicked (full mode)', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.isSelected = true;
          fixture.detectChanges();

          let trackCard = fixture.componentInstance.trackCard;
          spyOn(trackCard.seek, 'emit');

          expect(trackCard.seek.emit).not.toHaveBeenCalled();

          fixture.nativeElement.querySelector('waveform-timeline audio-timeline').click();

          expect(trackCard.seek.emit).toHaveBeenCalledTimes(1);
          expect(typeof trackCard.seek.emit.calls.argsFor(0)[0]).toBe('number');
        });
    });
  });
});
