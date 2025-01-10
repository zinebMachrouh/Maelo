import { Injectable } from '@angular/core';
import {Observable, from, firstValueFrom} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Track } from '../models/track.model';
import {IndexedDBService} from '../../../core/services/indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(private indexedDBService: IndexedDBService) {}

  async getTracks(): Promise<Track[]> {
    return firstValueFrom(this.indexedDBService.getAllTracks());
  }

  async getTrack(id: string): Promise<Track> {
    const track = await firstValueFrom(this.indexedDBService.getTrack(id));
    if (!track) throw new Error('Track not found');
    return track;
  }

  async addTrack(trackData: Partial<Track>, audioFile: File, coverImage?: File): Promise<Track> {
    await this.validateAudioFile(audioFile);
    if (coverImage) {
      await this.validateImageFile(coverImage);
    }

    const track: Track = {
      id: crypto.randomUUID(),
      title: trackData.title!,
      artist: trackData.artist!,
      description: trackData.description,
      addedDate: new Date(),
      duration: await this.getAudioDuration(audioFile),
      category: trackData.category!,
      fileSize: audioFile.size,
      audioUrl: URL.createObjectURL(audioFile),
      ...(coverImage && { coverImage: URL.createObjectURL(coverImage) })
    };

    return firstValueFrom(this.indexedDBService.addTrack(track, audioFile, coverImage));
  }

  async updateTrack(id: string, changes: Partial<Track>): Promise<Track> {
    return firstValueFrom(this.indexedDBService.updateTrack(id, changes));
  }

  async deleteTrack(id: string): Promise<void> {
    return firstValueFrom(this.indexedDBService.deleteTrack(id));
  }

  private validateAudioFile(file: File): Observable<void> {
    return from(new Promise<void>((resolve, reject) => {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        reject(new Error('File size exceeds 15MB limit'));
      }

      const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg'];
      if (!validTypes.includes(file.type)) {
        reject(new Error('Invalid audio file format. Supported formats: MP3, WAV, OGG'));
      }

      resolve();
    }));
  }

  private async validateImageFile(file: File): Promise<void> {
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid image format. Supported formats: JPEG, PNG');
    }
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
        URL.revokeObjectURL(audio.src);
      });

      audio.addEventListener('error', () => {
        reject(new Error('Error loading audio file'));
        URL.revokeObjectURL(audio.src);
      });
    });
  }
}
