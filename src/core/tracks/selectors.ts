import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

import { AppState, Selector } from 'src/core/interfaces';
import { TracksState } from './tracks-reducer';


export function getTracks(): Selector<AppState,TracksState> {
  return state$ => state$
    .map(state => state.tracks)
    .distinctUntilChanged();
}
