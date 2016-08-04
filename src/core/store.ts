import { provideStore } from '@ngrx/store';
import { tracklistsReducer } from './tracklists';
import { tracksReducer } from './tracks';


export const STORE_PROVIDERS = provideStore({
  tracklists: tracklistsReducer,
  tracks: tracksReducer
});
