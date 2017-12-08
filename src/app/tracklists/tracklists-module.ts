import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// components
import { TrackCardComponent } from './components/track-card';
import { TracklistComponent } from './components/tracklist';
import { TracklistItemsComponent } from './components/tracklist-items';
import { WaveformComponent } from './components/waveform';
import { WaveformTimelineComponent } from './components/waveform-timeline';

// modules
import { SharedModule } from '../shared';

// services
import { TracklistService } from './tracklist-service';


@NgModule({
  declarations: [
    TrackCardComponent,
    TracklistComponent,
    TracklistItemsComponent,
    WaveformComponent,
    WaveformTimelineComponent
  ],
  exports: [
    TracklistComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
  ],
  providers: [
    TracklistService
  ]
})
export class TracklistsModule {}
