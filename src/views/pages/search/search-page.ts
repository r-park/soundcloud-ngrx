import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/takeUntil';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QueryParams } from '@ngrx/router';
import { Subject } from 'rxjs/Subject';
import { SearchService } from 'src/core/search';
import { TracklistComponent } from '../../components/tracklist';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    TracklistComponent
  ],
  selector: 'search-page',
  template: `
    <tracklist></tracklist>
  `
})

export class SearchPage {
  ngOnDestroy$ = new Subject<boolean>();

  constructor(public params$: QueryParams, public search: SearchService) {
    params$
      .takeUntil(this.ngOnDestroy$)
      .pluck('q')
      .subscribe((value: string) => search.loadSearchResults(value));
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }
}
