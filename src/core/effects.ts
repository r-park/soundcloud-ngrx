import { runEffects } from '@ngrx/effects';
import { TracklistEffects } from './tracklists';


export const EFFECTS_PROVIDERS = runEffects(
  TracklistEffects
);
