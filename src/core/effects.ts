import { runEffects } from '@ngrx/effects';
import { PlayerEffects } from './player';
import { SearchEffects } from './search';
import { TracklistEffects } from './tracklists';
import { UserEffects } from './users';


export const EFFECTS_PROVIDERS = runEffects(
  PlayerEffects,
  SearchEffects,
  TracklistEffects,
  UserEffects
);
