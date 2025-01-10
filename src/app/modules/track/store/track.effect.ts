import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {from, of} from 'rxjs';
import {map, mergeMap, catchError, switchMap} from 'rxjs/operators';
import {TracksActions} from './track.action';
import {TrackService} from '../services/track.service';

@Injectable()
export class TracksEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.loadTracks),
      switchMap(() =>
        from(this.trackService.getTracks()).pipe(
          map(tracks => TracksActions.loadTracksSuccess({ tracks })),
          catchError(error => of(TracksActions.loadTracksFailure({ error: error.message })))
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.addTrack),
      switchMap(({ track, audioFile, coverImage }) =>
        from(this.trackService.addTrack(track, audioFile, coverImage)).pipe(
          map(newTrack => TracksActions.addTrackSuccess({ track: newTrack })),
          catchError(error => of(TracksActions.addTrackFailure({ error: error.message })))
        )
      )
    )
  );

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.updateTrack),
      switchMap(({ id, changes }) =>
        from(this.trackService.updateTrack(id, changes)).pipe(
          map(updatedTrack => TracksActions.updateTrackSuccess({ track: updatedTrack })),
          catchError(error => of(TracksActions.updateTrackFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TracksActions.deleteTrack),
      switchMap(({ id }) =>
        from(this.trackService.deleteTrack(id)).pipe(
          map(() => TracksActions.deleteTrackSuccess({ id })),
          catchError(error => of(TracksActions.deleteTrackFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private trackService: TrackService
  ) {}
}
