import { Routes } from '@angular/router';
import {DashboardComponent} from "./shared/components/dashboard/dashboard.component";
import {LibraryComponent} from "./shared/components/library/library.component";
import {LoginComponent} from "./modules/auth/components/login/login.component";
import {RegisterComponent} from "./modules/auth/components/register/register.component";
import {AuthGuard} from "./modules/auth/guards/auth.guard";
import {userResolver} from "./modules/auth/resolvers/user.resolver";

export const routes: Routes = [
  {path: '' , redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component : DashboardComponent},
  {
    path: 'library',
    component:LibraryComponent,
    canActivate: [AuthGuard],
    resolve: { user: userResolver },
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];
