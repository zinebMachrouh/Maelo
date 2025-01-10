import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {Track} from '../models/track.model';
import {TracksActions} from './track.action';

export interface TracksState extends EntityState<Track> {
  selectedTrackId: string | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export const tracksAdapter = createEntityAdapter<Track>();

export const initialState: TracksState = tracksAdapter.getInitialState({
  selectedTrackId: null,
  loading: false,
  error: null,
  searchQuery: ''
});

export const tracksReducer = createReducer(
  initialState,
  on(TracksActions.loadTracks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TracksActions.loadTracksSuccess, (state, { tracks }) =>
    tracksAdapter.setAll(tracks, { ...state, loading: false })
  ),
  on(TracksActions.loadTracksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(TracksActions.addTrackSuccess, (state, { track }) =>
    tracksAdapter.addOne(track, state)
  ),
  on(TracksActions.updateTrackSuccess, (state, { track }) =>
    tracksAdapter.updateOne({ id: track.id, changes: track }, state)
  ),
  on(TracksActions.deleteTrackSuccess, (state, { id }) =>
    tracksAdapter.removeOne(id, state)
  ),
  on(TracksActions.searchTracks, (state, { query }) => ({
    ...state,
    searchQuery: query
  }))
);
