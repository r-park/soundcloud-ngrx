import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

import { AppState, Selector } from 'src/core/interfaces';


export function getSearchQuery(): Selector<AppState,string> {
  return state$ => state$
    .map(state => state.search.query)
    .distinctUntilChanged();
}
