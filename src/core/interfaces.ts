import { Observable } from 'rxjs/Observable';
import { PlayerState, TimesState } from './player';
import { SearchState } from './search';
import { TracklistsState } from './tracklists';
import { TracksState } from './tracks';


export interface AppState {
  player: PlayerState;
  search: SearchState;
  times: TimesState;
  tracklists: TracklistsState;
  tracks: TracksState;
}

export interface Selector<T,V> {
  (observable$: Observable<T>): Observable<V>;
}
