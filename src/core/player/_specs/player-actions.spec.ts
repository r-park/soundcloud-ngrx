import { PlayerActions } from '../player-actions';


describe('player', () => {
  describe('PlayerActions', () => {
    let actions: PlayerActions;

    beforeEach(() => {
      actions = new PlayerActions();
    });


    describe('audioEnded()', () => {
      it('should create an action', () => {
        expect(actions.audioEnded())
          .toEqual({
            type: PlayerActions.AUDIO_ENDED
          });
      });
    });


    describe('audioPaused()', () => {
      it('should create an action', () => {
        expect(actions.audioPaused())
          .toEqual({
            type: PlayerActions.AUDIO_PAUSED
          });
      });
    });


    describe('audioPlaying()', () => {
      it('should create an action', () => {
        expect(actions.audioPlaying())
          .toEqual({
            type: PlayerActions.AUDIO_PLAYING
          });
      });
    });


    describe('audioVolumeChanged()', () => {
      it('should create an action', () => {
        expect(actions.audioVolumeChanged(5))
          .toEqual({
            type: PlayerActions.AUDIO_VOLUME_CHANGED,
            payload: {
              volume: 5
            }
          });
      });
    });


    describe('playSelectedTrack()', () => {
      it('should create an action when trackId and tracklistId are provided', () => {
        let trackId = 123;
        let tracklistId = 'tracklist/1';

        expect(actions.playSelectedTrack(trackId, tracklistId))
          .toEqual({
            type: PlayerActions.PLAY_SELECTED_TRACK,
            payload: {
              trackId,
              tracklistId
            }
          });
      });

      it('should create an action when only trackId is provided', () => {
        let trackId = 123;

        expect(actions.playSelectedTrack(trackId))
          .toEqual({
            type: PlayerActions.PLAY_SELECTED_TRACK,
            payload: {
              trackId,
              tracklistId: undefined
            }
          });
      });
    });
  });
});
