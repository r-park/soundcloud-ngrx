import { runEffects } from '@ngrx/effects';
import { SearchEffects } from './search';
import { TracklistEffects } from './tracklists';


export const EFFECTS_PROVIDERS = runEffects(
  SearchEffects,
  TracklistEffects
);
