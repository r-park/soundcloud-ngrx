import { Component, ViewChild } from '@angular/core';
import { addProviders, inject, TestComponentBuilder } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { ApiService } from 'src/core/api';
import { WaveformComponent } from './waveform';
import { waveformData } from './waveform.data';


@Component({
  directives: [WaveformComponent],
  template: ''
})
class TestComponent {
  @ViewChild(WaveformComponent) waveform: WaveformComponent;
}


describe('components', () => {
  describe('WaveformComponent', () => {
    let api;
    let builder;
    let fetchSubject;

    beforeEach(() => {
      fetchSubject = new Subject<any>();

      api = jasmine.createSpyObj('api', ['fetch']);
      api.fetch.and.callFake(() => fetchSubject);

      addProviders([
        {provide: ApiService, useValue: api}
      ]);

      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should fetch waveform json data', () => {
      builder
        .overrideTemplate(TestComponent, '<waveform [src]="src"></waveform>')
        .createAsync(TestComponent)
        .then(fixture => {
          fixture.componentInstance.src = 'http://foo';
          fixture.detectChanges();

          expect(api.fetch).toHaveBeenCalledTimes(1);
          expect(api.fetch).toHaveBeenCalledWith('http://foo');
        });
    });

    it('should render waveform json data to canvas', () => {
      builder
        .createAsync(WaveformComponent)
        .then(fixture => {
          fixture.detectChanges();

          spyOn(fixture.componentInstance, 'render');

          fetchSubject.next(waveformData);

          expect(fixture.componentInstance.render).toHaveBeenCalledTimes(1);
          expect(fixture.componentInstance.render).toHaveBeenCalledWith(waveformData);
        });
    });

    it('should add canvas to DOM', () => {
      builder
        .createAsync(WaveformComponent)
        .then(fixture => {
          fixture.detectChanges();

          fetchSubject.next(waveformData);

          let canvas = fixture.nativeElement.querySelector('canvas') as HTMLCanvasElement;

          expect(canvas instanceof HTMLCanvasElement).toBe(true);
          expect(canvas.width).toBe(waveformData.width / 2);
          expect(canvas.height).toBe(waveformData.height / 2);
        });
    });

    it('should emit `ready` event', () => {
      builder
        .createAsync(WaveformComponent)
        .then(fixture => {
          fixture.detectChanges();

          spyOn(fixture.componentInstance.ready, 'emit');

          fetchSubject.next(waveformData);

          expect(fixture.componentInstance.ready.emit).toHaveBeenCalledTimes(1);
        });
    });
  });
});
