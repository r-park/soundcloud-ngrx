import { Observable } from 'rxjs/Observable';
import { TracklistsState } from './tracklists';
import { TracksState } from './tracks';


export interface AppState {
  tracklists: TracklistsState;
  tracks: TracksState;
}

export interface Selector<T,V> {
  (observable$: Observable<T>): Observable<V>;
}
