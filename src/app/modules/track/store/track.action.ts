import { createActionGroup, props , emptyProps} from '@ngrx/store';
import { Track } from '../models/track.model';

export const TracksActions = createActionGroup({
  source: 'Tracks',
  events: {
    'Load Tracks': emptyProps(),
    'Load Tracks Success': props<{ tracks: Track[] }>(),
    'Load Tracks Failure': props<{ error: string }>(),
    'Add Track': props<{ track: Partial<Track>, audioFile: File, coverImage?: File }>(),
    'Add Track Success': props<{ track: Track }>(),
    'Add Track Failure': props<{ error: string }>(),
    'Update Track': props<{ id: string, changes: Partial<Track> }>(),
    'Update Track Success': props<{ track: Track }>(),
    'Update Track Failure': props<{ error: string }>(),
    'Delete Track': props<{ id: string }>(),
    'Delete Track Success': props<{ id: string }>(),
    'Delete Track Failure': props<{ error: string }>(),
    'Search Tracks': props<{ query: string }>(),
  }
});
