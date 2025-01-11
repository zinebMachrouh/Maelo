import { TestBed } from '@angular/core/testing';
import { IndexedDBService } from './indexeddb.service';
import { Track } from '../../modules/track/models/track.model';
import { firstValueFrom } from 'rxjs';
import { IDBPDatabase } from 'idb';
import { MusicCategory } from '../../modules/track/models/enums/MusicCategory';

describe('IndexedDBService', () => {
  let service: IndexedDBService;
  let mockDB: jasmine.SpyObj<IDBPDatabase>;
  let mockTransaction: any;
  let mockObjectStore: any;

  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    category: MusicCategory.BLUES,
    duration: 180,
    addedDate: new Date(),
    audioUrl: 'audio.mp3',
    fileSize: 1000,
    coverImage: 'cover.jpeg',
  };

  const mockAudioBlob = new Blob(['Audio content'], { type: 'audio/mp3' });
  const mockImageBlob = new Blob(['Image content'], { type: 'image/jpeg' });

  beforeEach(() => {
    mockObjectStore = jasmine.createSpyObj('ObjectStore', [
      'add',
      'get',
      'put',
      'delete',
      'getAll',
    ]);
    mockObjectStore.add.and.returnValue(Promise.resolve());
    mockObjectStore.get.and.returnValue(Promise.resolve(mockTrack));
    mockObjectStore.put.and.returnValue(Promise.resolve());
    mockObjectStore.delete.and.returnValue(Promise.resolve());
    mockObjectStore.getAll.and.returnValue(Promise.resolve([mockTrack]));

    mockTransaction = jasmine.createSpyObj('Transaction', ['objectStore']);
    mockTransaction.objectStore.and.callFake((storeName: string) => mockObjectStore);

    mockDB = jasmine.createSpyObj('IDBPDatabase', ['transaction', 'get', 'getAll']);
    mockDB.transaction.and.returnValue(mockTransaction);
    mockDB.get.and.callFake((storeName: string, id: string) => {
      if (storeName === 'audioFiles') return Promise.resolve({ file: mockAudioBlob });
      if (storeName === 'coverImages') return Promise.resolve({ file: mockImageBlob });
      return Promise.resolve(null);
    });
    mockDB.getAll.and.returnValue(Promise.resolve([mockTrack]));

    TestBed.configureTestingModule({
      providers: [IndexedDBService],
    });
    service = TestBed.inject(IndexedDBService);
    // @ts-ignore - Replace the private `db` property with the mock database
    service['db'] = Promise.resolve(mockDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTracks', () => {
    it('should return all tracks', async () => {
      const tracks = await firstValueFrom(service.getAllTracks());
      expect(tracks).toEqual([mockTrack]);
      expect(mockDB.transaction).toHaveBeenCalledWith('tracks', 'readonly');
      expect(mockObjectStore.getAll).toHaveBeenCalled();
    });
  });

  describe('getTrack', () => {
    it('should return a specific track by ID', async () => {
      const track = await firstValueFrom(service.getTrack('1'));
      expect(track).toEqual(mockTrack);
      expect(mockDB.transaction).toHaveBeenCalledWith('tracks', 'readonly');
      expect(mockObjectStore.get).toHaveBeenCalledWith('1');
    });
  });

  describe('addTrack', () => {
    it('should add a track with audio and cover image', async () => {
      const result = await firstValueFrom(service.addTrack(mockTrack, mockAudioBlob, mockImageBlob));

      expect(result).toEqual(mockTrack);
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('tracks');
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('audioFiles');
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('coverImages');
      expect(mockObjectStore.add).toHaveBeenCalledTimes(3);
    });

    it('should add a track without cover image', async () => {
      const result = await firstValueFrom(service.addTrack(mockTrack, mockAudioBlob));

      expect(result).toEqual(mockTrack);
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('tracks');
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('audioFiles');
      expect(mockObjectStore.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateTrack', () => {
    it('should update a track with partial changes', async () => {
      const changes = { title: 'Updated Title' };
      const expectedTrack = { ...mockTrack, ...changes };
      mockObjectStore.get.and.returnValue(Promise.resolve(mockTrack));

      const result = await firstValueFrom(service.updateTrack('1', changes));

      expect(result).toEqual(expectedTrack);
      expect(mockObjectStore.put).toHaveBeenCalledWith(expectedTrack);
    });
  });

  describe('deleteTrack', () => {
    it('should delete a track and its associated files', async () => {
      await firstValueFrom(service.deleteTrack('1'));

      expect(mockTransaction.objectStore).toHaveBeenCalledWith('tracks');
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('audioFiles');
      expect(mockTransaction.objectStore).toHaveBeenCalledWith('coverImages');
      expect(mockObjectStore.delete).toHaveBeenCalledTimes(3);
      expect(mockObjectStore.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('getAudioFile', () => {
    it('should return the audio blob for a track', async () => {
      const result = await firstValueFrom(service.getAudioFile('1'));
      expect(result).toEqual(mockAudioBlob);
      // @ts-ignore
      expect(mockDB.get).toHaveBeenCalledWith('audioFiles', '1');
    });
  });

});
