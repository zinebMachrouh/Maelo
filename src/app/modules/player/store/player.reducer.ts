import { createReducer, on } from '@ngrx/store';
import {PlayerState} from '../models/enums/PlayerState';
import {PlayerStatus} from '../models/enums/PlayerStatus';
import {PlayerActions} from './player.action';


export const initialState: PlayerState = {
  status: PlayerStatus.STOPPED,
  currentTrack: null,
  volume: 1,
  progress: 0,
  isLoading: false,
  error: null,
  queue: []
};

export const playerReducer = createReducer(
  initialState,
  on(PlayerActions.play, (state, { track }) => ({
    ...state,
    status: PlayerStatus.PLAYING,
    currentTrack: track
  })),
  on(PlayerActions.pause, (state) => ({
    ...state,
    status: PlayerStatus.PAUSED
  })),
  on(PlayerActions.stop, (state) => ({
    ...state,
    status: PlayerStatus.STOPPED,
    progress: 0
  })),
  on(PlayerActions.setVolume, (state, { volume }) => ({
    ...state,
    volume
  })),
  on(PlayerActions.setProgress, (state, { progress }) => ({
    ...state,
    progress
  })),
  on(PlayerActions.loadTrack, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PlayerActions.loadTrackSuccess, (state, { track }) => ({
    ...state,
    currentTrack: track,
    isLoading: false
  })),
  on(PlayerActions.loadTrackFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(PlayerActions.addToQueue, (state, { track }) => ({
    ...state,
    queue: [...state.queue, track]
  })),
  on(PlayerActions.removeFromQueue, (state, { trackId }) => ({
    ...state,
    queue: state.queue.filter(track => track.id !== trackId)
  })),
  on(PlayerActions.clearQueue, (state) => ({
    ...state,
    queue: []
  }))
);
