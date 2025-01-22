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
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient} from "@angular/common/http";
import {authInterceptor} from "./modules/auth/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore<AppState>({
      player: playerReducer,
      tracks: tracksReducer,
    }),
    provideEffects([PlayerEffects, TracksEffects]),
    {
      provide: HTTP_INTERCEPTORS,
      useValue: authInterceptor,
      multi: true,
    },
  ],
};
