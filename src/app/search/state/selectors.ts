import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

import { AppState } from 'app';
import { Selector } from 'app/core';


export function getSearchQuery(): Selector<AppState,string> {
  return state$ => state$
    .map(state => state.search.query)
    .distinctUntilChanged();
}
