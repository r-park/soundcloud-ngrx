import { inject, TestComponentBuilder } from '@angular/core/testing';
import { HomePageComponent } from './home-page';


describe('components', () => {
  describe('HomePageComponent', () => {
    let builder;

    beforeEach(() => {
      inject([TestComponentBuilder], tcb => {
        builder = tcb;
      })();
    });

    it('should have a title', () => {
      builder
        .createAsync(HomePageComponent)
        .then(fixture => {
          fixture.detectChanges();
          let title = fixture.nativeElement.querySelector('h1');
          expect(title.textContent).toBe('Home');
        });
    });
  });
});
