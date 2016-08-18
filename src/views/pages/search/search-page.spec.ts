import { Component } from '@angular/core';
import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { QueryParams } from '@ngrx/router';
import { Subject } from 'rxjs/Subject';
import { SearchService } from 'src/core/search';
import { TracklistComponent } from '../../components/tracklist';
import { SearchPageComponent } from './search-page';


@Component({
  selector: 'tracklist',
  template: ''
})
class TracklistComponentStub {}


describe('components', () => {
  describe('SearchPageComponent', () => {
    let builder;
    let queryParams;
    let search;

    beforeEach(() => {
      let searchService = jasmine.createSpyObj('search', ['loadSearchResults']);
      searchService.query$ = new Subject<any>();

      addProviders([
        {provide: QueryParams, useValue: new Subject<any>()},
        {provide: SearchService, useValue: searchService}
      ]);

      inject([TestComponentBuilder, QueryParams, SearchService], (tcb, _queryParams, _search) => {
        builder = tcb;
        queryParams = _queryParams;
        search = _search;
      })();
    });

    it('should initialize properties', () => {
      builder
        .overrideDirective(SearchPageComponent, TracklistComponent, TracklistComponentStub)
        .createAsync(SearchPageComponent)
        .then(fixture => {
          expect(fixture.componentInstance.section).toBe('Search Results');
          expect(fixture.componentInstance.ngOnDestroy$ instanceof Subject).toBe(true);
        });
    });

    it('should load search results using query params', () => {
      builder
        .overrideDirective(SearchPageComponent, TracklistComponent, TracklistComponentStub)
        .createAsync(SearchPageComponent)
        .then(() => {
          queryParams.next({q: 'test'});
          expect(search.loadSearchResults).toHaveBeenCalledTimes(1);
          expect(search.loadSearchResults).toHaveBeenCalledWith('test');
        });
    });

    it('should display current section and title', () => {
      builder
        .overrideDirective(SearchPageComponent, TracklistComponent, TracklistComponentStub)
        .createAsync(SearchPageComponent)
        .then(fixture => {
          fixture.detectChanges();

          search.query$.next('Foo Bar');

          fixture.detectChanges();

          let compiled = fixture.nativeElement;

          expect(compiled.querySelector('.content-header__section').textContent).toBe('Search Results /');
          expect(compiled.querySelector('.content-header__title').textContent).toBe('Foo Bar');
        });
    });
  });
});
