import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, inject, TestComponentBuilder } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { PlayerControlsComponent } from './player-controls';


@Component({
  directives: [PlayerControlsComponent],
  template: ''
})
class TestComponent {
  @ViewChild(PlayerControlsComponent) playerControls: PlayerControlsComponent;
}


describe('components', () => {
  describe('PlayerControlsComponent', () => {
    let builder;
    let currentTime;
    let cursor;
    let player;
    let track;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();

      currentTime = new Subject<number>();

      cursor = {
        nextTrackId: 3,
        previousTrackId: 1
      };

      player = {
        isPlaying: false,
        volume: 10
      };

      track = {
        title: 'Track Title',
        duration: 240000 // 4 minutes
      };
    });


    function buildComponent(): Promise<ComponentFixture<TestComponent>> {
      let template = `
        <player-controls 
          [currentTime]="currentTime"
          [cursor]="cursor"
          [player]="player"
          [track]="track"></player-controls>`;

      return builder
        .overrideTemplate(TestComponent, template)
        .createAsync(TestComponent)
        .then((fixture: ComponentFixture<TestComponent>) => {
          fixture.componentInstance.currentTime = currentTime;
          fixture.componentInstance.cursor = cursor;
          fixture.componentInstance.player = player;
          fixture.componentInstance.track = track;
          return fixture;
        });
    }


    it('should display track title', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let titleEl = fixture.nativeElement.querySelector('.player-controls__title');
          expect(titleEl.textContent).toBe(track.title);
        });
    });

    it('should display formatted times', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          currentTime.next(120);

          fixture.detectChanges();

          let timeEl = fixture.nativeElement.querySelector('.player-controls__time');

          expect(timeEl.textContent).toBe('02:00 / 04:00');
        });
    });

    it('should display formatted volume', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();
          let volumeEl = fixture.nativeElement.querySelector('.player-controls__volume');
          expect(volumeEl.textContent.trim()).toBe('1.0');
        });
    });

    it('should emit `play` event', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.play, 'emit');

          fixture.nativeElement.querySelector('.btn--play').click();

          expect(playerControls.play.emit).toHaveBeenCalledTimes(1);
        });
    });

    it('should emit `pause` event', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.player.isPlaying = true;
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.pause, 'emit');

          fixture.nativeElement.querySelector('.btn--pause').click();

          expect(playerControls.pause.emit).toHaveBeenCalledTimes(1);
        });
    });

    it('should emit `select` event for next track', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.select, 'emit');

          fixture.nativeElement.querySelector('.btn--skip-next').click();

          expect(playerControls.select.emit).toHaveBeenCalledTimes(1);
          expect(playerControls.select.emit).toHaveBeenCalledWith(cursor.nextTrackId);
        });
    });

    it('should NOT emit `select` event for next track if next track does NOT exist', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.cursor.nextTrackId = null;
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.select, 'emit');

          fixture.nativeElement.querySelector('.btn--skip-next').click();

          expect(playerControls.select.emit).not.toHaveBeenCalled();
        });
    });

    it('should emit `select` event for previous track', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.select, 'emit');

          fixture.nativeElement.querySelector('.btn--skip-previous').click();

          expect(playerControls.select.emit).toHaveBeenCalledTimes(1);
          expect(playerControls.select.emit).toHaveBeenCalledWith(cursor.previousTrackId);
        });
    });

    it('should NOT emit `select` event for previous track if previous track does NOT exist', () => {
      buildComponent()
        .then(fixture => {
          fixture.componentInstance.cursor.previousTrackId = null;
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.select, 'emit');

          fixture.nativeElement.querySelector('.btn--skip-previous').click();

          expect(playerControls.select.emit).not.toHaveBeenCalled();
        });
    });

    it('should emit `decreaseVolume` event', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.decreaseVolume, 'emit');

          fixture.nativeElement.querySelector('.btn--remove').click();

          expect(playerControls.decreaseVolume.emit).toHaveBeenCalledTimes(1);
        });
    });

    it('should emit `increaseVolume` event', () => {
      buildComponent()
        .then(fixture => {
          fixture.detectChanges();

          let playerControls = fixture.componentInstance.playerControls;

          spyOn(playerControls.increaseVolume, 'emit');

          fixture.nativeElement.querySelector('.btn--add').click();

          expect(playerControls.increaseVolume.emit).toHaveBeenCalledTimes(1);
        });
    });
  });
});
