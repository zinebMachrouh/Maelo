import {Track} from '../../../track/models/track.model';
import {PlayerStatus} from './PlayerStatus';

export interface PlayerState {
  status: PlayerStatus;
  currentTrack: Track | null;
  volume: number;
  progress: number;
  isLoading: boolean;
  error: string | null;
  queue: Track[];
}
