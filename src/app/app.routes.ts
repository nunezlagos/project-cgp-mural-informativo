// app.routes.ts
import { Routes } from '@angular/router';
import { MuralComponent } from './features/mural/mural.component';
import { AdminComponent } from './features/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'mural', pathMatch: 'full' },
  { path: 'mural', component: MuralComponent }
  { path: 'administracion', component: AdminComponent }
];
