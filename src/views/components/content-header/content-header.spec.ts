import { Component } from '@angular/core';
import { inject, TestComponentBuilder } from '@angular/core/testing';
import { ContentHeaderComponent } from './content-header';


@Component({
  directives: [ContentHeaderComponent],
  template: ''
})
class TestComponent {}


describe('components', () => {
  describe('ContentHeaderComponent', () => {
    let builder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should display provided section and title', () => {
      builder
        .overrideTemplate(TestComponent, '<content-header [section]="section" [title]="title"></content-header>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.section = 'Section';
          fixture.componentInstance.title = 'Title';
          fixture.detectChanges();

          let compiled = fixture.nativeElement;

          expect(compiled.querySelector('.content-header__section').textContent).toBe('Section /');
          expect(compiled.querySelector('.content-header__title').textContent).toBe('Title');
        });
    });
  });
});
