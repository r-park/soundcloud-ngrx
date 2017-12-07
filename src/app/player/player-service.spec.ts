import { TestBed } from '@angular/core/testing';
import { AUDIO_SOURCE_PROVIDER } from './audio-source';
import { PlayerService } from './player-service';
import { PlayerActions } from './player-actions';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { TracklistService } from '../tracklists';
import { MockBackend } from '@angular/http/testing';
import { ApiService } from '../core/services/api';
import { is, List } from 'immutable';
import { ITracklist, TracklistRecord, TrackRecord } from 'app/tracklists/models';
import { ITimesState, TimesStateRecord } from './state';


describe('player', () => {
  describe('PlayerService', () => {
    let playerService: PlayerService;
    let tracklistService: TracklistService;
    let actions: PlayerActions;

    beforeEach(() => {
      let injector = TestBed.configureTestingModule({
        providers: [
          AUDIO_SOURCE_PROVIDER,
          PlayerActions,
          PlayerService,
          TracklistService,
          ApiService,
          BaseRequestOptions,
          MockBackend,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions): Http => {
              return new Http(backend, options);
            }
          }
        ]
      });

      actions = injector.get(PlayerActions);
      tracklistService = injector.get(TracklistService);
      playerService = injector.get(PlayerService);


      tracklistService.mountTracklist(new TracklistRecord({
        id: 'tracklist/1',
        trackIds: List([1, 2, 3])
      }) as ITracklist);

      tracklistService.mountAllTracks(new Map()
        .set(1, new TrackRecord({ id: 1, streamUrl: 'http://stream/1' }))
        .set(2, new TrackRecord({ id: 2, streamUrl: 'http://stream/2' }))
        .set(3, new TrackRecord({ id: 3, streamUrl: 'http://stream/3' })));
    });


    describe('cursor$', () => {
      it('should stream the player tracklist cursor', () => {
        let cursor = null;

        playerService.cursor$.subscribe(value => {
          cursor = value;
        });

        playerService.select({ trackId: 1, tracklistId: 'tracklist/1' });

        expect(cursor.toJS()).toEqual({
          currentTrackId: 1,
          nextTrackId: 2,
          previousTrackId: null
        });

        playerService.select({ trackId: 2, tracklistId: 'tracklist/1' });

        expect(cursor.toJS()).toEqual({
          currentTrackId: 2,
          nextTrackId: 3,
          previousTrackId: 1
        });

        playerService.select({ trackId: 3, tracklistId: 'tracklist/1' });

        expect(cursor.toJS()).toEqual({
          currentTrackId: 3,
          nextTrackId: null,
          previousTrackId: 2
        });
      });
    });

    describe('player$', () => {
      it('should stream the player state', () => {
        let count = 0;
        let player = null;

        playerService.player$.subscribe(value => {
          count++;
          player = value;
        });

        expect(count).toBe(1);

        playerService.dispatchAction(actions.audioPlaying());

        expect(count).toBe(2);
        expect(player.isPlaying).toBe(true);

        // should not emit: no change
        playerService.dispatchAction(actions.audioPlaying());
        expect(count).toBe(2);

        // changing trackId should emit
        playerService.select({ trackId: 1 });
        expect(count).toBe(3);

        playerService.dispatchAction(actions.audioPaused());
        expect(count).toBe(4);
        expect(player.isPlaying).toBe(false);

        // dispatching unrelated action should not emit
        playerService.dispatchAction({ type: 'UNDEFINED' });
        expect(count).toBe(4);
      });

      it('should set trackId and tracklistId to provided value', () => {
        const trackId = 1;
        let player = null;
        const tracklistId = 'tracklist/1';


        playerService.player$.subscribe(value => {
          player = value;
        });

        playerService.select({ trackId: 1, tracklistId });
        expect(player.trackId).toBe(trackId);
        expect(player.tracklistId).toBe(tracklistId);
      });
    });

    describe('track$', () => {
      it('should stream the player track', () => {
        let count = 0;
        let track = null;

        playerService.track$.subscribe(value => {
          count++;
          track = value;
        });

        // changing trackId should emit
        playerService.select({ trackId: 1, tracklistId: 'tracklist/1' });
        expect(count).toBe(1);
        expect(track.id).toBe(1);

        // should not emit: same trackId
        playerService.select({ trackId: 1, tracklistId: 'tracklist/1' });
        expect(count).toBe(1);

        // changing trackId should emit
        playerService.select({ trackId: 2, tracklistId: 'tracklist/1' });
        expect(count).toBe(2);
        expect(track.id).toBe(2);
      });

      it('should call play() with track.streamUrl when track changes', () => {
        let track;

        spyOn(playerService, 'play');
        playerService.track$.subscribe(value => track = value);

        playerService.select({ trackId: 1, tracklistId: 'tracklist/1' });
        expect(playerService.play).toHaveBeenCalledWith(track.streamUrl);
      });
    });

    describe('times$', () => {
      it('should update player current time', () => {
        let time = null;
        let updatedTime = new TimesStateRecord() as ITimesState;
        updatedTime = updatedTime.set('currentTime', 10) as ITimesState;

        playerService.times$.subscribe(value => {
          time = value;
        });

        expect(time.currentTime).toBe(0);

        playerService.dispatchAction(actions.audioTimeUpdated(updatedTime));
        expect(time.currentTime).toBe(10);
      });

      it('should reset state.times to zero if track switched', () => {
        let time = null;
        let updatedTime = new TimesStateRecord() as ITimesState;
        updatedTime = updatedTime.set('currentTime', 10) as ITimesState;

        playerService.times$.subscribe(value => {
          time = value;
        });

        playerService.dispatchAction(actions.audioTimeUpdated(updatedTime));
        expect(time.currentTime).toBe(10);

        playerService.select({ trackId: 1 });
        expect(is(time, new TimesStateRecord())).toBe(true);
      });

      it('should reset state.times to zero if track ended', () => {
        let time = null;
        let updatedTime = new TimesStateRecord() as ITimesState;
        updatedTime = updatedTime.set('currentTime', 10) as ITimesState;

        playerService.times$.subscribe(value => {
          time = value;
        });

        playerService.dispatchAction(actions.audioTimeUpdated(updatedTime));
        expect(time.currentTime).toBe(10);

        playerService.dispatchAction(actions.audioEnded());
        expect(is(time, new TimesStateRecord())).toBe(true);
      });
    });
  });
});

