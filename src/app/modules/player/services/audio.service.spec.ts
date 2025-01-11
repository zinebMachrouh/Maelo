import {TestBed} from '@angular/core/testing';
import {AudioService} from './audio.service';
import {IndexedDBService} from '../../../core/services/indexeddb.service';
import {Track} from '../../track/models/track.model';
import {of, throwError} from 'rxjs';
import {MusicCategory} from "../../track/models/enums/MusicCategory";

describe('AudioService', () => {
  let service: AudioService;
  let indexedDBServiceMock: jasmine.SpyObj<IndexedDBService>;
  let mockTrack: Track;

  beforeEach(() => {
    mockTrack = {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      addedDate: new Date(),
      duration: 300,
      category: MusicCategory.INDIE,
      audioUrl: 'test-url',
      fileSize: 5000,
    };

    indexedDBServiceMock = jasmine.createSpyObj('IndexedDBService', [
      'getAllTracks',
      'getTrack',
      'getAudioFile',
    ]);

    indexedDBServiceMock.getAllTracks.and.returnValue(of([mockTrack]));
    indexedDBServiceMock.getTrack.and.callFake((id: string) => {
      return id === mockTrack.id ? of(mockTrack) : throwError(() => new Error('Track not found'));
    });
    indexedDBServiceMock.getAudioFile.and.callFake((id: string) => {
      return id === mockTrack.id ? of(new Blob(['audio content'], { type: 'audio/mpeg' })) : throwError(() => new Error('Audio file not found'));
    });

    TestBed.configureTestingModule({
      providers: [
        AudioService,
        { provide: IndexedDBService, useValue: indexedDBServiceMock },
      ],
    });

    service = TestBed.inject(AudioService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Loading tracks', () => {
    it('should load a track by ID', (done: DoneFn) => {
      service.loadTrack(mockTrack.id).subscribe({
        next: (track) => {
          expect(track).toEqual(mockTrack);
          done();
        },
        error: () => {
          fail('Expected track to load successfully');
        },
      });
    });

    it('should handle errors when track is not found', (done: DoneFn) => {
      service.loadTrack('non-existent-id').subscribe({
        next: () => {
          fail('Expected an error when loading a non-existent track');
        },
        error: (error) => {
          expect(error.message).toBe('Track not found');
          done();
        },
      });
    });
  });

  describe('Playback controls', () => {
    it('should play the loaded track', (done: DoneFn) => {
      service.loadTrack(mockTrack.id).subscribe(() => {
        service.play().subscribe({
          next: () => {
            expect(service.getCurrentTime()).toBe(0); // Initially starts at 0
            done();
          },
          error: () => {
            fail('Expected track to play successfully');
          },
        });
      });
    });

    it('should pause the track', () => {
      spyOn(service['audioElement'], 'pause');
      service.pause();
      expect(service['audioElement'].pause).toHaveBeenCalled();
    });
  });

  describe('Track navigation', () => {
    it('should navigate to the next track', (done: DoneFn) => {
      service.nextTrack();
      expect(indexedDBServiceMock.getTrack).toHaveBeenCalled();
      service.loadTrack(mockTrack.id).subscribe({
        next: () => {
          expect(service['currentTrackIndex']).toBe(1);
          done();
        },
      });
    });

    it('should navigate to the previous track', (done: DoneFn) => {
      service.previousTrack();
      expect(indexedDBServiceMock.getTrack).toHaveBeenCalled();
      service.loadTrack(mockTrack.id).subscribe({
        next: () => {
          expect(service['currentTrackIndex']).toBe(0);
          done();
        },
      });
    });
  });

  describe('Volume control', () => {
    it('should update volume', () => {
      const newVolume = 0.5;
      service.setVolume(newVolume);
      expect(service['gainNode'].gain.value).toBe(newVolume);
    });
  });

  describe('Progress updates', () => {
    it('should update the current track progress during time update', (done: DoneFn) => {
      spyOn(service['timeUpdateSubject'], 'next');
      service.onTimeUpdate().subscribe(() => {
        expect(service['timeUpdateSubject'].next).toHaveBeenCalled();
        done();
      });
    });
  });
});
