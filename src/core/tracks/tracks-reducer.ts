import { Action, ActionReducer } from '@ngrx/store';
import { Map } from 'immutable';
import { TracklistActions } from 'src/core/tracklists';
import { createTrack, Track, TrackData } from './track';


export type TracksState = Map<number,Track>;

const initialState: TracksState = Map<number,Track>();


export const tracksReducer: ActionReducer<TracksState> = (state: TracksState = initialState, action: Action) => {
  switch (action.type) {
    case TracklistActions.FETCH_TRACKS_FULFILLED:
      return state.withMutations(tracks => {
        action.payload.collection.forEach((data: TrackData) => {
          tracks.set(data.id, createTrack(data));
        });
      });

    default:
      return state;
  }
};
