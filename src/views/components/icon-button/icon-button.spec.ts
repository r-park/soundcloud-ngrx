import { Component } from '@angular/core';
import { inject, TestComponentBuilder } from '@angular/core/testing';
import { IconButtonComponent } from './icon-button';


@Component({
  directives: [IconButtonComponent],
  template: ''
})
class TestComponent {}


describe('components', () => {
  describe('IconButtonComponent', () => {
    let builder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should have default css class', () => {
      builder
        .overrideTemplate(TestComponent, '<icon-button></icon-button>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          let button = fixture.nativeElement.querySelector('button');

          expect(button.classList).toContain('btn');
          expect(button.classList).toContain('btn--icon');
        });
    });

    it('should have provided css classes', () => {
      builder
        .overrideTemplate(TestComponent, '<icon-button className="foo"></icon-button>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          let button = fixture.nativeElement.querySelector('button');

          expect(button.classList).toContain('btn');
          expect(button.classList).toContain('btn--icon');
          expect(button.classList).toContain('foo');
        });
    });

    it('should have a label', () => {
      builder
        .overrideTemplate(TestComponent, '<icon-button label="foo"></icon-button>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          let button = fixture.nativeElement.querySelector('button');

          expect(button.getAttribute('aria-label')).toBe('foo');
        });
    });

    it('should xlink to the correct svg content', () => {
      builder
        .overrideTemplate(TestComponent, '<icon-button icon="test"></icon-button>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          let use = fixture.nativeElement.querySelector('use');

          expect(use.getAttribute('xlink:href')).toBe('#icon-test');
        });
    });

    it('should emit `onClick` event when button is clicked', () => {
      builder
        .createAsync(IconButtonComponent)
        .then(fixture => {
          fixture.componentInstance.onClick.subscribe(event => {
            expect(event instanceof MouseEvent).toBe(true);
          });

          fixture.detectChanges();
          fixture.nativeElement.querySelector('button').click();
        });
    });
  });
});
