import { Action } from '@ngrx/store';
import { PlayerActions } from '../player-actions';
import { PlayerState, PlayerStateRecord } from './player-state';


export const initialState: PlayerState = new PlayerStateRecord() as PlayerState;


export function playerReducer(state: PlayerState = initialState, {payload, type}: Action): PlayerState {
  switch (type) {
    case PlayerActions.AUDIO_ENDED:
    case PlayerActions.AUDIO_PAUSED:
      return state.set('isPlaying', false) as PlayerState;

    case PlayerActions.AUDIO_PLAYING:
      return state.set('isPlaying', true) as PlayerState;

    case PlayerActions.AUDIO_VOLUME_CHANGED:
      return state.set('volume', payload.volume) as PlayerState;

    case PlayerActions.PLAY_SELECTED_TRACK:
      return state.merge({
        trackId: payload.trackId,
        tracklistId: payload.tracklistId || state.get('tracklistId')
      }) as PlayerState;

    default:
      return state;
  }
}
