import { provideStore } from '@ngrx/store';
import { searchReducer } from './search';
import { tracklistsReducer } from './tracklists';
import { tracksReducer } from './tracks';


export const STORE_PROVIDERS = provideStore({
  search: searchReducer,
  tracklists: tracklistsReducer,
  tracks: tracksReducer
});
