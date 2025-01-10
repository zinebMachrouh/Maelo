import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Track } from '../../../track/models/track.model';
import { AudioService } from '../../services/audio.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  standalone: true,
  imports: [NgClass, NgIf],
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnChanges {
  @Input() track?: Track;

  currentTime = 0;
  duration = 0;
  volume = 50;
  isPlaying = false;
  currentTimeFormatted: string = '00:00';

  pauseAt = 0;
  startAt = 0;

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.audioService.onTimeUpdate().subscribe((progress) => {
      this.currentTime = progress * this.duration;
      this.currentTimeFormatted = this.formatDuration(this.currentTime);
    });

    this.audioService.currentTrack$.subscribe((track) => {
      if (track && track.id !== this.track?.id) {
        this.track = track;
        this.loadAndPlayTrack(track);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['track'] && this.track) {
      this.loadAndPlayTrack(this.track);
    }
  }

  loadAndPlayTrack(track: Track): void {
    this.loadTrack(track);
    this.play();
  }

  formatDuration(duration: number): string {
    const totalSeconds = Math.floor(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  loadTrack(track: Track): void {
    this.audioService.loadTrack(track.id).subscribe({
      next: () => {
        this.duration = track.duration;
        this.currentTime = this.audioService.getCurrentTime();
        if (this.startAt > 0) {
          this.audioService.seekTo(this.startAt / this.duration);
        }
      },
      error: (err) => console.error('Error loading track:', err),
    });
  }

  play(): void {
    if (!this.track) {
      console.error('No track available to play.');
      return;
    }

    this.audioService.play(this.track).subscribe({
      next: () => {
        this.isPlaying = true;
      },
      error: (err) => {
        console.error('Error playing track:', err);
        this.isPlaying = false;
      },
    });
  }

  pause(): void {
    this.audioService.pause();
    this.isPlaying = false;
    this.pauseAt = this.currentTime;
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.startAt = this.pauseAt;
      this.play();
    }
  }

  seek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const progress = +input.value / 100;
    this.audioService.seekTo(progress);
    this.startAt = progress * this.duration;
  }

  changeVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = +input.value / 100;
    this.audioService.setVolume(volume);
  }

  nextTrack(): void {
    this.audioService.nextTrack();
  }

  previousTrack(): void {
    this.audioService.previousTrack();
  }
}
