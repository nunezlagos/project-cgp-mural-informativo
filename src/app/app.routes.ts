// app.routes.ts
import { Routes } from '@angular/router';
import { MuralComponent } from './features/mural/mural.component';
import { AdminComponent } from './features/admin/admin.component';
import { CircularesComponent } from './features/circulares/circulares.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'mural', pathMatch: 'full' },
  { path: 'mural', component: MuralComponent },
  { path: 'circulares', component: CircularesComponent },
  { path: 'administracion', component: AdminComponent, canActivate: [AuthGuard] }  // Aplica el guard aquí
];
