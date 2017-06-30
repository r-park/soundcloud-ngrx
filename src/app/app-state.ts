import { ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { playerReducer, PlayerState, timesReducer, TimesState } from '../player';
import { searchReducer, SearchState } from '../search';
import { tracklistsReducer, TracklistsState, tracksReducer, TracksState } from '../tracklists';
import { usersReducer, UsersState } from '../users';


export interface AppState {
  player: PlayerState;
  search: SearchState;
  times: TimesState;
  tracklists: TracklistsState;
  tracks: TracksState;
  users: UsersState;
}


export const AppStateModule: ModuleWithProviders = StoreModule.provideStore({
  player: playerReducer,
  search: searchReducer,
  times: timesReducer,
  tracklists: tracklistsReducer,
  tracks: tracksReducer,
  users: usersReducer
});
