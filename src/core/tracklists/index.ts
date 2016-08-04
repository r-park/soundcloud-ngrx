import { TracklistActions } from './tracklist-actions';
import { TracklistService } from './tracklist-service';


export { TracklistActions, TracklistService };
export { TracklistEffects } from './tracklist-effects';
export { TracklistsState, tracklistsReducer } from './tracklists-reducer';


export const TRACKLISTS_PROVIDERS = [
  TracklistActions,
  TracklistService
];
