import { Routes } from '@angular/router';
import {DashboardComponent} from "./shared/components/dashboard/dashboard.component";
import {LibraryComponent} from "./shared/components/library/library.component";

export const routes: Routes = [
  {path: '' , redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component : DashboardComponent},
  {path: 'library', component:LibraryComponent}
];
