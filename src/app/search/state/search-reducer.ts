import { Action } from '@ngrx/store';
import { SearchActions } from '../search-actions';
import { SearchState, SearchStateRecord } from './search-state';


const initialState: SearchState = new SearchStateRecord() as SearchState;


export function searchReducer(state: SearchState = initialState, action: Action): SearchState {
  switch (action.type) {
    case SearchActions.LOAD_SEARCH_RESULTS:
      return state.set('query', action.payload.query) as SearchState;

    default:
      return state;
  }
}
