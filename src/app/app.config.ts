import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideStore} from "@ngrx/store";
import {playerReducer} from "./modules/player/store/player.reducer";
import {tracksReducer} from "./modules/track/store/track.reducer";
import {provideEffects} from "@ngrx/effects";
import {PlayerEffects} from "./modules/player/store/player.effect";
import {TracksEffects} from "./modules/track/store/track.effect";
import {AppState} from "./app.state";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore<AppState>({
      player: playerReducer,
      tracks: tracksReducer
    }),
    provideEffects([PlayerEffects, TracksEffects]),
  ]
};
