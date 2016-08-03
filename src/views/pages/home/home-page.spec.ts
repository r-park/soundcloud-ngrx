import { inject, TestComponentBuilder } from '@angular/core/testing';
import { HomePage } from './home-page';


describe('views', () => {
  describe('HomePage', () => {
    let builder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should have a title', () => {
      builder
        .createAsync(HomePage)
        .then(fixture => {
          fixture.detectChanges();
          let title = fixture.nativeElement.querySelector('h1');
          expect(title.textContent).toBe('Home');
        });
    });
  });
});
