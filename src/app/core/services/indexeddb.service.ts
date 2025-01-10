import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { openDB, IDBPDatabase } from 'idb';
import {Track} from '../../modules/track/models/track.model';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'MaeloDB';
  private version = 1;
  private readonly db: Promise<IDBPDatabase>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, this.version, {
      upgrade(db) {
        // Create tracks store
        if (!db.objectStoreNames.contains('tracks')) {
          const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
          trackStore.createIndex('title', 'title', { unique: false });
          trackStore.createIndex('artist', 'artist', { unique: false });
          trackStore.createIndex('category', 'category', { unique: false });
        }

        // Create audio files store
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id' });
        }

        // Create cover images store
        if (!db.objectStoreNames.contains('coverImages')) {
          db.createObjectStore('coverImages', { keyPath: 'id' });
        }
      }
    });
  }

  getAllTracks(): Observable<Track[]> {
    // @ts-ignore
    return from((async () => {
      const db = await this.db;
      return db.getAll('tracks');
    })());
  }

  getTrack(id: string): Observable<Track> {
    // @ts-ignore
    return from((async () => {
      const db = await this.db;
      return db.get('tracks', id);
    })());
  }

  addTrack(track: Track, audioFile: Blob, coverImage?: Blob): Observable<Track> {
    return from((async () => {
      const db = await this.db;
      const tx = db.transaction(['tracks', 'audioFiles', 'coverImages'], 'readwrite');

      await tx.objectStore('tracks').add(track);
      await tx.objectStore('audioFiles').add({ id: track.id, file: audioFile });

      if (coverImage) {
        await tx.objectStore('coverImages').add({ id: track.id, file: coverImage });
      }

      await tx.done;
      return track;
    })());
  }

  updateTrack(id: string, changes: Partial<Track>): Observable<Track> {
    return from((async () => {
      const db = await this.db;
      const tx = db.transaction('tracks', 'readwrite');
      const store = tx.objectStore('tracks');

      const track = await store.get(id);
      const updatedTrack = { ...track, ...changes };
      await store.put(updatedTrack);
      await tx.done;

      return updatedTrack;
    })());
  }

  deleteTrack(id: string): Observable<void> {
    // @ts-ignore
    return from((async () => {
      const db = await this.db;
      const tx = db.transaction(['tracks', 'audioFiles', 'coverImages'], 'readwrite');

      await tx.objectStore('tracks').delete(id);
      await tx.objectStore('audioFiles').delete(id);
      await tx.objectStore('coverImages').delete(id);

      await tx.done;
    })());
  }

  getAudioFile(id: string): Observable<Blob> {
    return from((async () => {
      const db = await this.db;
      const result = await db.get('audioFiles', id);
      return result.file;
    })());
  }

  getCoverImage(id: string): Observable<Blob> {
    return from((async () => {
      const db = await this.db;
      const result = await db.get('coverImages', id);
      if (result){
        return result.file;
      }
      return result?.file;
    })());
  }
}
