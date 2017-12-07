import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IAppState } from 'app';
import { SearchActions } from './search-actions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TracklistService } from '../tracklists/tracklist-service';
import { tracklistIdForSearch } from './utils';


@Injectable()
export class SearchService {
  query$: Observable<string>;

  private querySubject: BehaviorSubject<string>;

  constructor(private actions: SearchActions, private store$: Store<IAppState>, private tracklistService: TracklistService) {
    // this.query$ = store$.let(getSearchQuery());
    this.querySubject = new BehaviorSubject(null);
    this.query$ = this.querySubject.asObservable();
  }

  loadSearchResults(query: string): void {
    if (typeof query === 'string' && query.length) {
      this.querySubject.next(query);
      this.tracklistService.loadSearchTracks(query, tracklistIdForSearch(query));
    }
  }
}
