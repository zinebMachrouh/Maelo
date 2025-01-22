import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const userResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(AuthService);
  return authService.currentUser$;
};
