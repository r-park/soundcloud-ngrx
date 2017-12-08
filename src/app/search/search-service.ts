import 'rxjs/add/operator/let';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TracklistService } from '../tracklists';
import { tracklistIdForSearch } from './utils';


@Injectable()
export class SearchService {
  query$: Observable<string>;

  private querySubject: BehaviorSubject<string>;

  constructor(private tracklistService: TracklistService) {
    this.querySubject = new BehaviorSubject(null);
    this.query$ = this.querySubject.asObservable();
  }

  loadSearchResults(query: string): void {
    if (query && this.querySubject.getValue() !== query) {
      this.querySubject.next(query);
      this.tracklistService.loadSearchTracks(query, tracklistIdForSearch(query));
    }
  }
}
