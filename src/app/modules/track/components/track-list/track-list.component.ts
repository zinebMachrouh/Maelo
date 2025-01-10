import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MusicCategory} from '../../models/enums/MusicCategory';
import {CommonModule} from '@angular/common';
import {TrackCardComponent} from '../track-card/track-card.component';
import {TrackFormComponent} from '../track-form/track-form.component';
import {Track} from '../../models/track.model';
import {TrackService} from "../../services/track.service";
import {debounceTime, distinctUntilChanged, from} from "rxjs";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-track-list',
  imports: [
    RouterLink,
    CommonModule,
    TrackCardComponent,
    TrackFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './track-list.component.html',
  standalone: true,
  styleUrl: './track-list.component.scss'
})
export class TrackListComponent implements OnInit {
  @Output() playTrack = new EventEmitter<Track>();

  tracks: Track[] = [];
  originalTracks: Track[] = [];
  tracksCount: number = 0;
  showModal = false;
  musicCategories: MusicCategory[] = [];
  selectedTrack: Track | null = null;
  searchControl = new FormControl('');
  activeCategory: string = 'All';


  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.musicCategories = Object.values(MusicCategory) as MusicCategory[];
    this.getAllTracks();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchTracks(value || '');
    });
  }

  getAllTracks(): void {
    this.activeCategory = 'All';
    from(this.trackService.getTracks()).subscribe({
      next: (tracks: Track[]) => {
        this.tracks = tracks;
        this.originalTracks = [...tracks];
        this.tracksCount = tracks.length;
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }

  editTrack(track : Track): void {
    console.log('Edit track');
    this.selectedTrack = track;
    this.showModal = true;
  }

  onTrackPlay(track: Track): void {
    this.playTrack.emit(track);
  }

  openModal(): void {
    this.selectedTrack = null;
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
  }

  deleteTrack(id: string): void {
    from(this.trackService.deleteTrack(id)).subscribe({
      next: () => {
        this.getAllTracks();
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }

  searchTracks(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.tracks = [...this.originalTracks];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.tracks = this.originalTracks.filter(track =>
      track.title.toLowerCase().includes(term) ||
      track.artist.toLowerCase().includes(term) ||
      // @ts-ignore
      track.description.toLowerCase().includes(term)
    );
  }

  filterByCategory(category: MusicCategory): void {
    this.activeCategory = category;
    this.tracks = this.originalTracks.filter(track => track.category === category);
  }

  onSaveTrack(trackData: Partial<Track>, audioFile: File, coverImage?: File) {
    if (this.selectedTrack) {
      from(this.trackService.updateTrack(this.selectedTrack.id, trackData)).subscribe({
        next: () => {
          this.getAllTracks();
          this.showModal = false;
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
    } else {
      from(this.trackService.addTrack(trackData, audioFile, coverImage)).subscribe({
        next: () => {
          this.getAllTracks();
          this.showModal = false;
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
    }
  }
}
