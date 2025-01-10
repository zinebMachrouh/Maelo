import {Component, EventEmitter, Output} from '@angular/core';
import {PlayerComponent} from '../../../modules/player/components/player/player.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TrackListComponent} from '../../../modules/track/components/track-list/track-list.component';
import {Track} from "../../../modules/track/models/track.model";

@Component({
  selector: 'app-library',
  imports: [
    PlayerComponent,
    RouterLinkActive,
    RouterLink,
    TrackListComponent
  ],
  templateUrl: './library.component.html',
  standalone: true,
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  selectedTrack: Track | null = null;
  @Output() playTrack = new EventEmitter<Track>();

  onPlayTrack(track: Track): void {
    this.selectedTrack = track;
    this.playTrack.emit(track);
  }
}
