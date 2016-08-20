import { provideStore } from '@ngrx/store';
import { playerReducer, timesReducer } from './player';
import { searchReducer } from './search';
import { tracklistsReducer } from './tracklists';
import { tracksReducer } from './tracks';
import { usersReducer } from './users';


export const STORE_PROVIDERS = provideStore({
  player: playerReducer,
  search: searchReducer,
  times: timesReducer,
  tracklists: tracklistsReducer,
  tracks: tracksReducer,
  users: usersReducer
});
