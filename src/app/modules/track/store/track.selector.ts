import { createFeatureSelector, createSelector } from '@ngrx/store';
import {tracksAdapter, TracksState} from './track.reducer';

export const selectTracksState = createFeatureSelector<TracksState>('tracks');

export const {
  selectIds: selectTrackIds,
  selectEntities: selectTrackEntities,
  selectAll: selectAllTracks,
  selectTotal: selectTotalTracks,
} = tracksAdapter.getSelectors(selectTracksState);

export const selectSelectedTrackId = createSelector(
  selectTracksState,
  (state) => state.selectedTrackId
);

export const selectSelectedTrack = createSelector(
  selectTrackEntities,
  selectSelectedTrackId,
  (trackEntities, selectedId) => selectedId ? trackEntities[selectedId] : null
);

export const selectTracksLoading = createSelector(
  selectTracksState,
  (state) => state.loading
);

export const selectTracksError = createSelector(
  selectTracksState,
  (state) => state.error
);

export const selectSearchQuery = createSelector(
  selectTracksState,
  (state) => state.searchQuery
);

export const selectFilteredTracks = createSelector(
  selectAllTracks,
  selectSearchQuery,
  (tracks, query) => {
    if (!query) return tracks;
    const lowercaseQuery = query.toLowerCase();
    return tracks.filter(track =>
      track.title.toLowerCase().includes(lowercaseQuery) ||
      track.artist.toLowerCase().includes(lowercaseQuery)
    );
  }
);
