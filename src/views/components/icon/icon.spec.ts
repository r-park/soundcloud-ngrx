import { Component } from '@angular/core';
import { inject, TestComponentBuilder } from '@angular/core/testing';
import { IconComponent } from './icon';


@Component({
  directives: [IconComponent],
  template: ''
})
class TestComponent {}


describe('components', () => {
  describe('IconComponent', () => {
    let builder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should render with default css class', () => {
      builder
        .overrideTemplate(TestComponent, '<icon name="test"></icon>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          let svg = fixture.nativeElement.querySelector('svg');

          expect(svg.classList).toContain('icon');
        });
    });

    it('should render with provided css classes', () => {
      builder
        .overrideTemplate(TestComponent, '<icon className="foo bar" name="test"></icon>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          let svg = fixture.nativeElement.querySelector('svg');

          expect(svg.classList).toContain('icon');
          expect(svg.classList).toContain('foo');
          expect(svg.classList).toContain('bar');
        });
    });

    it('should xlink to the correct svg content', () => {
      builder
        .overrideTemplate(TestComponent, '<icon name="test"></icon>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.detectChanges();

          let use = fixture.nativeElement.querySelector('use');

          expect(use.getAttribute('xlink:href')).toBe('#icon-test');
        });
    });
  });
});
