import { Component, ViewChild } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';
import { Router } from '@ngrx/router';
import { SearchBarComponent } from './search-bar';


@Component({
  directives: [SearchBarComponent],
  template: ''
})
class TestComponent {
  @ViewChild(SearchBarComponent) searchBar: SearchBarComponent;
}


describe('components', () => {
  describe('SearchBarComponent', () => {
    let builder;
    let router;

    beforeEach(() => {
      addProviders([
        disableDeprecatedForms(),
        provideForms(),
        {provide: Router, useValue: jasmine.createSpyObj('router', ['go'])}
      ]);

      inject([TestComponentBuilder, Router], (tcb, _router) => {
        builder = tcb;
        router = _router;
      })();
    });


    it('should clear input element value when search bar is opened', () => {
      builder
        .overrideTemplate(TestComponent, '<search-bar [open]="open"></search-bar>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.searchBar.searchInput.updateValue('test');
          fixture.detectChanges();

          expect(fixture.componentInstance.searchBar.searchInput.value).toBe('test');

          fixture.componentInstance.open = true;
          fixture.detectChanges();

          expect(fixture.componentInstance.searchBar.searchInput.value).toBe('');
        });
    });

    it('should focus input element when search bar is opened', () => {
      builder
        .overrideTemplate(TestComponent, '<search-bar [open]="open"></search-bar>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          spyOn(fixture.componentInstance.searchBar.searchInputEl, 'focus');

          fixture.componentInstance.open = true;
          fixture.detectChanges();
          fixture.nativeElement.querySelector('.search-bar').dispatchEvent(new Event('transitionend'));

          expect(fixture.componentInstance.searchBar.searchInputEl.focus).toHaveBeenCalledTimes(1);
        });
    });


    describe('submit handler', () => {
      it('should be invoked on submit', () => {
        builder
          .createAsync(SearchBarComponent)
          .then(fixture => {
            fixture.detectChanges();

            spyOn(fixture.componentInstance, 'submit');

            dispatchEvent(
              fixture.nativeElement.querySelector('form'),
              'submit'
            );

            expect(fixture.componentInstance.submit).toHaveBeenCalledTimes(1);
          });
      });

      it('should call router.go() if search value is NOT empty', () => {
        builder
          .createAsync(SearchBarComponent)
          .then(fixture => {
            fixture.componentInstance.searchInput.updateValue('test');
            fixture.detectChanges();

            dispatchEvent(
              fixture.nativeElement.querySelector('form'),
              'submit'
            );

            expect(router.go).toHaveBeenCalledTimes(1);
          });
      });

      it('should NOT call router.go() if search value is empty', () => {
        builder
          .createAsync(SearchBarComponent)
          .then(fixture => {
            fixture.detectChanges();

            dispatchEvent(
              fixture.nativeElement.querySelector('form'),
              'submit'
            );

            expect(router.go).not.toHaveBeenCalled();
          });
      });
    });
  });
});
