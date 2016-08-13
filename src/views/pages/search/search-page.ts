import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/takeUntil';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QueryParams } from '@ngrx/router';
import { Subject } from 'rxjs/Subject';
import { SearchService } from 'src/core/search';

import { ContentHeaderComponent } from '../../components/content-header';
import { TracklistComponent } from '../../components/tracklist';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [
    ContentHeaderComponent,
    TracklistComponent
  ],
  template: `
    <section>
      <content-header 
        [section]="section" 
        [title]="search.query$ | async"></content-header>
  
      <tracklist></tracklist>
    </section>
  `
})

export class SearchPageComponent {
  ngOnDestroy$ = new Subject<boolean>();
  section = 'Search Results';

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
