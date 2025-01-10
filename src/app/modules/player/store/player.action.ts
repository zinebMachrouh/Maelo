import { createActionGroup, props, emptyProps } from '@ngrx/store';
import {Track} from '../../track/models/track.model';


export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    'Play': props<{ track: Track }>(),
    'Pause': emptyProps(),
    'Stop': emptyProps(),
    'Set Volume': props<{ volume: number }>(),
    'Set Progress': props<{ progress: number }>(),
    'Load Track': props<{ trackId: string }>(),
    'Load Track Success': props<{ track: Track }>(),
    'Load Track Failure': props<{ error: string }>(),
    'Add To Queue': props<{ track: Track }>(),
    'Remove From Queue': props<{ trackId: string }>(),
    'Clear Queue': emptyProps(),
    'Next Track': emptyProps(),
    'Previous Track': emptyProps(),
  }
});
