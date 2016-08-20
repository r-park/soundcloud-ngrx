import { Component } from '@angular/core';
import { TracklistService } from 'src/core/tracklists';
import { ContentHeaderComponent } from '../../components/content-header';
import { TracklistComponent } from '../../components/tracklist';


@Component({
  directives: [
    ContentHeaderComponent,
    TracklistComponent
  ],
  selector: 'home',
  template: `
    <section>
      <content-header 
        [section]="section" 
        [title]="title"></content-header>

      <tracklist [layout]="layout"></tracklist>
    </section>
  `
})

export class HomePageComponent {
  layout: string = 'compact';
  section: string = 'Spotlight';
  title: string = 'Featured Tracks';

  constructor(public tracklist: TracklistService) {
    tracklist.loadFeaturedTracks();
  }
}
