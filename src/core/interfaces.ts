import { Observable } from 'rxjs/Observable';
import { PlayerState } from './player';
import { SearchState } from './search';
import { TracklistsState } from './tracklists';
import { TracksState } from './tracks';


export interface AppState {
  player: PlayerState;
  search: SearchState;
  tracklists: TracklistsState;
  tracks: TracksState;
}

export interface Selector<T,V> {
  (observable$: Observable<T>): Observable<V>;
}
