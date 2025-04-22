// app.routes.ts
import { Routes } from '@angular/router';
import { MuralComponent } from './features/mural/mural.component';
import { AdminComponent } from './features/admin/admin.component';
import { CircularesComponent } from './features/circulares/circulares.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: MuralComponent },  // Ahora esta es la raíz directamente
  { path: 'circulares', component: CircularesComponent },
  { path: 'administracion', component: AdminComponent, canActivate: [AuthGuard] }
];
