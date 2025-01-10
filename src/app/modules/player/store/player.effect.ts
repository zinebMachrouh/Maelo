import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {from, of} from 'rxjs';
import {map, mergeMap, catchError, switchMap} from 'rxjs/operators';
import {PlayerActions} from './player.action';
import {AudioService} from '../services/audio.service';

@Injectable()
export class PlayerEffects {

  constructor(
    private actions$: Actions,
    private audioService: AudioService,
  ) {
    console.log('Actions:', this.actions$); // Add this line
    console.log("test");
  }

  loadTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.loadTrack),
      mergeMap(({ trackId }) =>
        this.audioService.loadTrack(trackId).pipe(
          map((track) => {
            if (!track) {
              return PlayerActions.loadTrackFailure({ error: 'Track not found' });
            }
            return PlayerActions.loadTrackSuccess({ track });
          }),
          catchError((error) => of(PlayerActions.loadTrackFailure({ error })))
        )
      )
    )
  );

  play$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.play),
      switchMap(({ track }) =>
        from(this.audioService.play(track)).pipe(
          map(() => PlayerActions.loadTrackSuccess({ track })),
          catchError(error => of(PlayerActions.loadTrackFailure({ error: error.message })))
        )
      )
    );
  });

}
