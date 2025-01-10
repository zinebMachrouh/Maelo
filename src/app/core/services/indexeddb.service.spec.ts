import { TestBed } from '@angular/core/testing';
import { IndexedDBService } from './indexeddb.service';
import { Track } from '../../modules/track/models/track.model';
import { IDBPDatabase } from 'idb';
import {MusicCategory} from "../../modules/track/models/enums/MusicCategory";

describe('IndexedDBService', () => {
  let service: IndexedDBService;
  let mockDB: jasmine.SpyObj<IDBPDatabase>;
  let mockTrackStore: any;
  let mockAudioStore: any;
  let mockCoverStore: any;

  const mockTrack: Track = {
    id: '123',
    title: 'Test Track',
    artist: 'Test Artist',
    description: 'Test Description',
    addedDate: new Date(),
    duration: 180,
    category: MusicCategory.ROCK,
    audioUrl: 'test-url',
    fileSize: 1024
  };

  const mockAudioBlob = new Blob(['test audio'], { type: 'audio/mp3' });
  const mockImageBlob = new Blob(['test image'], { type: 'image/jpeg' });

  beforeEach(() => {
    mockTrackStore = {
      add: jasmine.createSpy('add'),
      get: jasmine.createSpy('get'),
      getAll: jasmine.createSpy('getAll'),
      put: jasmine.createSpy('put'),
      delete: jasmine.createSpy('delete')
    };

    mockAudioStore = {
      add: jasmine.createSpy('add'),
      get: jasmine.createSpy('get'),
      delete: jasmine.createSpy('delete')
    };

    mockCoverStore = {
      add: jasmine.createSpy('add'),
      get: jasmine.createSpy('get'),
      delete: jasmine.createSpy('delete')
    };

    mockDB = jasmine.createSpyObj('IDBPDatabase', ['transaction']);
    // @ts-ignore
    // @ts-ignore
    mockDB.transaction.and.returnValue({
      objectStore: (storeName: string) => {
        switch (storeName) {
          case 'tracks':
            return mockTrackStore;
          case 'audioFiles':
            return mockAudioStore;
          case 'coverImages':
            return mockCoverStore;
        }
      },
      done: Promise.resolve(),
      mode: 'readonly',
      objectStoreNames: undefined,
      db: "MaeloDB",
      store: undefined,
      onabort: null,
      onerror: null,
      addEventListener: function <K extends keyof IDBTransactionEventMap>(type: K, listener: (this: IDBTransaction, ev: IDBTransactionEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void {
        throw new Error('Function not implemented.');
      },
      removeEventListener: function <K extends keyof IDBTransactionEventMap>(type: K, listener: (this: IDBTransaction, ev: IDBTransactionEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void {
        throw new Error('Function not implemented.');
      },
      dispatchEvent: function (event: Event): boolean {
        throw new Error('Function not implemented.');
      },
      durability: 'default',
      error: null,
      oncomplete: null,
      abort: function (): void {
        throw new Error('Function not implemented.');
      },
      commit: function (): void {
        throw new Error('Function not implemented.');
      }
    });

    TestBed.configureTestingModule({
      providers: [IndexedDBService]
    });

    service = TestBed.inject(IndexedDBService);
    // @ts-ignore - Override the private db property for testing
    service['db'] = Promise.resolve(mockDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTracks', () => {
    it('should return all tracks from the database', (done) => {
      const mockTracks = [mockTrack];
      mockTrackStore.getAll.and.returnValue(Promise.resolve(mockTracks));

      service.getAllTracks().subscribe(tracks => {
        expect(tracks).toEqual(mockTracks);
        expect(mockTrackStore.getAll).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getTrack', () => {
    it('should return a specific track by id', (done) => {
      mockTrackStore.get.and.returnValue(Promise.resolve(mockTrack));

      service.getTrack('123').subscribe(track => {
        expect(track).toEqual(mockTrack);
        expect(mockTrackStore.get).toHaveBeenCalledWith('123');
        done();
      });
    });
  });

  describe('addTrack', () => {
    it('should add a track with audio and cover image', (done) => {
      mockTrackStore.add.and.returnValue(Promise.resolve());
      mockAudioStore.add.and.returnValue(Promise.resolve());
      mockCoverStore.add.and.returnValue(Promise.resolve());

      service.addTrack(mockTrack, mockAudioBlob, mockImageBlob).subscribe(track => {
        expect(track).toEqual(mockTrack);
        expect(mockTrackStore.add).toHaveBeenCalledWith(mockTrack);
        expect(mockAudioStore.add).toHaveBeenCalledWith({
          id: mockTrack.id,
          file: mockAudioBlob
        });
        expect(mockCoverStore.add).toHaveBeenCalledWith({
          id: mockTrack.id,
          file: mockImageBlob
        });
        done();
      });
    });

    it('should add a track without cover image', (done) => {
      mockTrackStore.add.and.returnValue(Promise.resolve());
      mockAudioStore.add.and.returnValue(Promise.resolve());

      service.addTrack(mockTrack, mockAudioBlob).subscribe(track => {
        expect(track).toEqual(mockTrack);
        expect(mockTrackStore.add).toHaveBeenCalledWith(mockTrack);
        expect(mockAudioStore.add).toHaveBeenCalled();
        expect(mockCoverStore.add).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('updateTrack', () => {
    it('should update a track with partial changes', (done) => {
      const changes = { title: 'Updated Title' };
      const updatedTrack = { ...mockTrack, ...changes };

      mockTrackStore.get.and.returnValue(Promise.resolve(mockTrack));
      mockTrackStore.put.and.returnValue(Promise.resolve());

      service.updateTrack('123', changes).subscribe(track => {
        expect(track).toEqual(updatedTrack);
        expect(mockTrackStore.get).toHaveBeenCalledWith('123');
        expect(mockTrackStore.put).toHaveBeenCalledWith(updatedTrack);
        done();
      });
    });
  });

  describe('deleteTrack', () => {
    it('should delete a track and its associated files', (done) => {
      mockTrackStore.delete.and.returnValue(Promise.resolve());
      mockAudioStore.delete.and.returnValue(Promise.resolve());
      mockCoverStore.delete.and.returnValue(Promise.resolve());

      service.deleteTrack('123').subscribe(() => {
        expect(mockTrackStore.delete).toHaveBeenCalledWith('123');
        expect(mockAudioStore.delete).toHaveBeenCalledWith('123');
        expect(mockCoverStore.delete).toHaveBeenCalledWith('123');
        done();
      });
    });
  });

  describe('getAudioFile', () => {
    it('should return the audio file blob for a track', (done) => {
      mockAudioStore.get.and.returnValue(Promise.resolve({ file: mockAudioBlob }));

      service.getAudioFile('123').subscribe(blob => {
        expect(blob).toEqual(mockAudioBlob);
        expect(mockAudioStore.get).toHaveBeenCalledWith('123');
        done();
      });
    });
  });

  describe('getCoverImage', () => {
    it('should return the cover image blob if it exists', (done) => {
      mockCoverStore.get.and.returnValue(Promise.resolve({ file: mockImageBlob }));

      service.getCoverImage('123').subscribe(blob => {
        expect(blob).toEqual(mockImageBlob);
        expect(mockCoverStore.get).toHaveBeenCalledWith('123');
        done();
      });
    });

    it('should return undefined if no cover image exists', (done) => {
      mockCoverStore.get.and.returnValue(Promise.resolve(undefined));

      service.getCoverImage('123').subscribe(blob => {
        expect(blob).toBeUndefined();
        expect(mockCoverStore.get).toHaveBeenCalledWith('123');
        done();
      });
    });
  });
});
