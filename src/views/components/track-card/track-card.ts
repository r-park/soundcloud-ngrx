import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Track } from 'src/core/tracks';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'track-card',
  template: `
    <div style="border-top: 1px solid #ddd;">{{track.title}}</div>
  `
})

export class TrackCardComponent {
  @Input() track: Track;
}
