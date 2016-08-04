import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { List } from 'immutable';
import { TRACKS_PER_PAGE } from 'src/core/constants';
import { AppState, Selector } from 'src/core/interfaces';
import { getTracks, Track } from 'src/core/tracks';
import { Tracklist } from './tracklist';
import { TracklistsState } from './tracklists-reducer';


export function getTracklists(): Selector<AppState,TracklistsState> {
  return state$ => state$
    .map(state => state.tracklists)
    .distinctUntilChanged();
}

export function getCurrentTracklist(): Selector<AppState,Tracklist> {
  return state$ => state$
    .let(getTracklists())
    .map(tracklists => tracklists.get(tracklists.get('currentTracklistId')))
    .filter(tracklist => tracklist)
    .distinctUntilChanged();
}

export function getTracksForCurrentTracklist(): Selector<AppState,List<Track>> {
  return state$ => state$
    .let(getCurrentTracklist())
    .distinctUntilChanged((previous, next) => {
      return previous.currentPage === next.currentPage &&
             previous.trackIds === next.trackIds;
    })
    .withLatestFrom(state$.let(getTracks()), (tracklist, tracks) => {
      return tracklist.trackIds
        .slice(0, tracklist.currentPage * TRACKS_PER_PAGE)
        .map(id => tracks.get(id)) as List<Track>;
    });
}
