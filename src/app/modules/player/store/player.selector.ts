import { createFeatureSelector, createSelector } from '@ngrx/store';
import {PlayerState} from '../models/enums/PlayerState';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentTrack = createSelector(
  selectPlayerState,
  (state) => state.currentTrack
);

export const selectPlayerStatus = createSelector(
  selectPlayerState,
  (state) => state.status
);

export const selectVolume = createSelector(
  selectPlayerState,
  (state) => state.volume
);

export const selectProgress = createSelector(
  selectPlayerState,
  (state) => state.progress
);

export const selectIsLoading = createSelector(
  selectPlayerState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectPlayerState,
  (state) => state.error
);

export const selectQueue = createSelector(
  selectPlayerState,
  (state) => state.queue
);
