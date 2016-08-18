import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlayerService } from 'src/core/player';
import { PlayerComponent } from './player';


describe('components', () => {
  describe('PlayerComponent', () => {
    let builder;
    let playerService;

    beforeEach(() => {
      let playerServiceStub = jasmine.createSpyObj('playerService', [
        'decreaseVolume',
        'increaseVolume',
        'pause',
        'play',
        'seek',
        'select'
      ]);

      playerServiceStub.currentTime$ = new BehaviorSubject<any>(120);
      playerServiceStub.cursor$ = new BehaviorSubject<any>({
        nextTrackId: 3,
        previousTrackId: 1
      });
      playerServiceStub.player$ = new BehaviorSubject<any>({
        isPlaying: false,
        volume: 10
      });
      playerServiceStub.times$ = new BehaviorSubject<any>({
        bufferedTime: 200,
        duration: 400,
        percentBuffered: '50%',
        percentCompleted: '25%'
      });
      playerServiceStub.track$ = new BehaviorSubject<any>({
        title: 'Track Title',
        duration: 240000 // 4 minutes
      });

      addProviders([
        {provide: PlayerService, useValue: playerServiceStub}
      ]);

      inject([TestComponentBuilder, PlayerService], (tcb, _playerService) => {
        builder = tcb;
        playerService = _playerService;
      })();
    });


    it('should add css class `open` to container when player starts playing', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();

          expect(fixture.nativeElement.classList).not.toContain('open');

          playerService.player$.next({isPlaying: true});

          expect(fixture.nativeElement.classList).toContain('open');
        });
    });

    it('should call PlayerService#seek() when audio timeline is clicked', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();
          fixture.nativeElement.querySelector('audio-timeline').click();

          expect(playerService.seek).toHaveBeenCalledTimes(1);
          expect(typeof playerService.seek.calls.argsFor(0)[0]).toBe('number');
        });
    });

    it('should call PlayerService#decreaseVolume() when decrease volume button is clicked', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();
          fixture.nativeElement.querySelector('.btn--remove').click();

          expect(playerService.decreaseVolume).toHaveBeenCalledTimes(1);
        });
    });

    it('should call PlayerService#increaseVolume() when increase volume button is clicked', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();
          fixture.nativeElement.querySelector('.btn--add').click();

          expect(playerService.increaseVolume).toHaveBeenCalledTimes(1);
        });
    });

    it('should call PlayerService#pause() when pause button is clicked', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();

          playerService.player$.next({
            isPlaying: true,
            volume: 10
          });

          fixture.detectChanges();
          fixture.nativeElement.querySelector('.btn--pause').click();

          expect(playerService.pause).toHaveBeenCalledTimes(1);
        });
    });

    it('should call PlayerService#play() when play button is clicked', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();
          fixture.nativeElement.querySelector('.btn--play').click();

          expect(playerService.play).toHaveBeenCalledTimes(1);
        });
    });

    it('should call PlayerService#select() when skip-next button is clicked', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();
          fixture.nativeElement.querySelector('.btn--skip-next').click();

          expect(playerService.select).toHaveBeenCalledTimes(1);
          expect(playerService.select).toHaveBeenCalledWith({trackId: 3});
        });
    });

    it('should call PlayerService#select() when skip-previous button is clicked', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();
          fixture.nativeElement.querySelector('.btn--skip-previous').click();

          expect(playerService.select).toHaveBeenCalledTimes(1);
          expect(playerService.select).toHaveBeenCalledWith({trackId: 1});
        });
    });

    it('should display formatted times', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();

          let timeEl = fixture.nativeElement.querySelector('.player-controls__time');

          expect(timeEl.textContent).toBe('02:00 / 04:00');
        });
    });

    it('should display formatted volume', () => {
      builder
        .createAsync(PlayerComponent)
        .then(fixture => {
          fixture.detectChanges();

          let volumeEl = fixture.nativeElement.querySelector('.player-controls__volume');

          expect(volumeEl.textContent.trim()).toBe('1.0');
        });
    });
  });
});
