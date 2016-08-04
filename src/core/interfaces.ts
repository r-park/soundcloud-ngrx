import { Observable } from 'rxjs/Observable';
import { SearchState } from './search';
import { TracklistsState } from './tracklists';
import { TracksState } from './tracks';


export interface AppState {
  search: SearchState;
  tracklists: TracklistsState;
  tracks: TracksState;
}

export interface Selector<T,V> {
  (observable$: Observable<T>): Observable<V>;
}
