import { Component } from '@angular/core';
import { inject, TestComponentBuilder } from '@angular/core/testing';
import { TimesStateRecord } from 'src/core/player';
import { AudioTimelineComponent } from './audio-timeline';


@Component({
  directives: [AudioTimelineComponent],
  template: ''
})
class TestComponent {}


describe('components', () => {
  describe('AudioTimelineComponent', () => {
    let builder;
    let times;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();

      times = new TimesStateRecord({
        bufferedTime: 200,
        duration: 400,
        percentBuffered: '50%',
        percentCompleted: '25%'
      });
    });

    it('should set widths of bars', () => {
      builder
        .overrideTemplate(TestComponent, '<audio-timeline [times]="times"></audio-timeline>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.times = times;
          fixture.detectChanges();

          let compiled = fixture.nativeElement;

          expect(compiled.querySelector('.bar--buffered').style.width).toBe('50%');
          expect(compiled.querySelector('.bar--elapsed').style.width).toBe('25%');
        });
    });

    it('should add css class to `buffered` bar if buffered amount is not zero', () => {
      builder
        .overrideTemplate(TestComponent, '<audio-timeline [times]="times"></audio-timeline>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.times = times;
          fixture.detectChanges();

          let compiled = fixture.nativeElement;

          expect(compiled.querySelector('.bar--buffered').classList).toContain('bar--animated');

          fixture.componentInstance.times = times.set('bufferedTime', 0);
          fixture.detectChanges();

          expect(compiled.querySelector('.bar--buffered').classList).not.toContain('bar--animated');
        });
    });

    it('should emit seek event when host element is clicked', () => {
      let template = '<audio-timeline (seek)="seek($event)" [times]="times" style="width: 100px;"></audio-timeline>';

      builder
        .overrideTemplate(TestComponent, template)
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.seek = jasmine.createSpy('seek');
          fixture.componentInstance.times = times;
          fixture.detectChanges();

          expect(fixture.componentInstance.seek).not.toHaveBeenCalled();

          fixture.nativeElement.querySelector('audio-timeline').click();

          expect(fixture.componentInstance.seek).toHaveBeenCalledTimes(1);
        });
    });
  });
});
