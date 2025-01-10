import {TracksState} from "./modules/track/store/track.reducer";
import {PlayerState} from "./modules/player/models/enums/PlayerState";

export interface AppState {
  player: PlayerState;
  tracks: TracksState;
}
