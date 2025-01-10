import { Injectable } from '@angular/core';
import { from, Observable, Subject, BehaviorSubject } from 'rxjs';
import { Track } from '../../track/models/track.model';
import { IndexedDBService } from '../../../core/services/indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext;
  private audioElement: HTMLAudioElement;
  private gainNode: GainNode;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private timeUpdateSubject = new Subject<number>();
  private tracks: Track[] = [];
  private currentTrackIndex: number = 0;
  private startAt: number = 0;

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  constructor(private indexedDBService: IndexedDBService) {
    this.audioContext = new AudioContext();
    this.audioElement = new Audio();
    this.gainNode = this.audioContext.createGain();
    this.setupAudioGraph();
    this.setupTimeUpdate();

    this.indexedDBService.getAllTracks().subscribe({
      next: (tracks: Track[]) => {
        this.tracks = tracks;
      },
      error: (error) => {
        console.error('Error fetching tracks:', error);
      }
    });
  }

  private setupAudioGraph(): void {
    this.gainNode.connect(this.audioContext.destination);
    this.audioElement.addEventListener('canplay', () => {
      if (!this.audioSource) {
        this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.audioSource.connect(this.gainNode);
      }
    });
  }

  private setupTimeUpdate(): void {
    this.audioElement.addEventListener('timeupdate', () => {
      const progress = this.audioElement.currentTime / this.audioElement.duration;
      this.timeUpdateSubject.next(progress);
    });
  }

  loadTrack(trackId: string): Observable<Track> {
    return new Observable(observer => {
      this.indexedDBService.getTrack(trackId).subscribe({
        next: (track) => {
          if (track) {
            this.indexedDBService.getAudioFile(trackId).subscribe({
              next: (audioBlob) => {
                if (audioBlob) {
                  this.audioElement.src = URL.createObjectURL(audioBlob);
                  this.audioElement.load();

                  if (track.id != this.currentTrackSubject.value?.id) {
                    this.startAt = 0;
                  }

                  this.currentTrackIndex = this.tracks.findIndex((t) => t.id === trackId);
                  this.currentTrackSubject.next(track);
                  observer.next(track);
                } else {
                  observer.error(new Error('Audio file not found'));
                }
              },
              error: (error) => observer.error(error)
            });
          } else {
            observer.error(new Error('Track not found'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  play(track?: Track): Observable<void> {
    if (track) {
      return new Observable<void>((observer) => {
        this.loadTrack(track.id).subscribe({
          next: () => {
            this.audioContext.resume().then(() => {
              this.audioElement.currentTime = this.startAt > 0 ? this.startAt : 0;

              this.audioElement.play().then(() => {
                observer.next();
                observer.complete();
              }).catch((err) => {
                observer.error(err);
              });
            }).catch((err) => {
              observer.error(err);
            });
          },
          error: (err) => observer.error(err),
        });
      });
    }

    return from(this.audioContext.resume().then(() => {
      this.audioElement.currentTime = this.startAt > 0 ? this.startAt : 0;
      return this.audioElement.play();
    }));
  }

  pause(): void {
    this.audioElement.pause();
  }

  setVolume(value: number): void {
    this.gainNode.gain.value = value;
  }

  seekTo(progress: number): void {
    this.audioElement.currentTime = progress * this.audioElement.duration;
    this.startAt = this.audioElement.currentTime;
  }

  getCurrentTime(): number {
    return this.audioElement.currentTime;
  }

  onTimeUpdate(): Observable<number> {
    return this.timeUpdateSubject.asObservable();
  }

  nextTrack(): void {
    if (this.currentTrackIndex < this.tracks.length - 1) {
      this.currentTrackIndex++;
      this.loadTrack(this.tracks[this.currentTrackIndex].id).subscribe({
        next: () => {
          this.play().subscribe({
            error: (err) => console.error('Error playing next track:', err),
          });
        },
        error: (err) => console.error('Error loading next track:', err),
      });
    } else {
      alert('No next track available');
    }
  }

  previousTrack(): void {
    if (this.currentTrackIndex > 0) {
      this.currentTrackIndex--;
      this.loadTrack(this.tracks[this.currentTrackIndex].id).subscribe({
        next: () => {
          this.play().subscribe({
            error: (err) => console.error('Error playing previous track:', err),
          });
        },
        error: (err) => console.error('Error loading previous track:', err),
      });
    } else {
      alert('No previous track available');
    }
  }
}
