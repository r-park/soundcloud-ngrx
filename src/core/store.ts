import { provideStore } from '@ngrx/store';
import { playerReducer } from './player';
import { searchReducer } from './search';
import { tracklistsReducer } from './tracklists';
import { tracksReducer } from './tracks';


export const STORE_PROVIDERS = provideStore({
  player: playerReducer,
  search: searchReducer,
  tracklists: tracklistsReducer,
  tracks: tracksReducer
});
