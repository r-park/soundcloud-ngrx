import { SearchActions } from './search-actions';
import { SearchService } from './search-service';


export { SearchActions, SearchService };
export { SearchEffects } from './search-effects';
export { searchReducer } from './search-reducer';
export { SearchState } from './search-state';


export const SEARCH_PROVIDERS = [
  SearchActions,
  SearchService
];
