import { Action } from '@ngrx/store';
import { PaginatedData } from 'src/core/api';


export class TracklistActions {
  static FETCH_TRACKS_FAILED = 'FETCH_TRACKS_FAILED';
  static FETCH_TRACKS_FULFILLED = 'FETCH_TRACKS_FULFILLED';
  static LOAD_NEXT_TRACKS = 'LOAD_NEXT_TRACKS';
  static MOUNT_TRACKLIST = 'MOUNT_TRACKLIST';


  fetchTracksFailed(error: any): Action {
    return {
      type: TracklistActions.FETCH_TRACKS_FAILED,
      payload: error
    };
  }

  fetchTracksFulfilled(data: PaginatedData, tracklistId: string): Action {
    return {
      type: TracklistActions.FETCH_TRACKS_FULFILLED,
      payload: Object.assign({}, data, {tracklistId})
    };
  }

  loadNextTracks(): Action {
    return {
      type: TracklistActions.LOAD_NEXT_TRACKS
    };
  }

  mountTracklist(tracklistId: string): Action {
    return {
      type: TracklistActions.MOUNT_TRACKLIST,
      payload: {
        tracklistId
      }
    };
  }
}
