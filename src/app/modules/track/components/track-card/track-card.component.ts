import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Track} from "../../models/track.model";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-track-card',
  imports: [
    NgIf
  ],
  templateUrl: './track-card.component.html',
  standalone: true,
  styleUrl: './track-card.component.scss'
})
export class TrackCardComponent implements OnInit, OnDestroy {
  @Input() track!: Track;
  @Input() index!: number;
  @Input() editTrack: ((track: any) => void) | undefined;
  @Input() deleteTrack: ((id: any) => void) | undefined;
  @Output() playTrack = new EventEmitter<Track>();

  duration: number = 0;
  formattedDuration: string = '00:00';
  private interval: any;

  constructor() { }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.duration += 1;
      this.formattedDuration = this.formatDuration(this.duration);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onPlay(): void {
    this.playTrack.emit(this.track);
  }

  onEdit() {
    console.log('1. Edit track:', this.track);
    if (this.editTrack) {
      console.log('2. Edit track:', this.track);
      this.editTrack(this.track);
    }
  }

  onDelete() {
    if (this.deleteTrack) {
      this.deleteTrack(this.track.id);
    }
  }

  formatDuration(duration: number): string {
    const totalSeconds = Math.floor(duration);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatCreationDate(date: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();

    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks >= 1) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays >= 1) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}
