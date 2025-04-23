// app.routes.ts
import { Routes } from '@angular/router';
import { MuralComponent } from './features/mural/mural.component';
import { AdminComponent } from './features/admin/admin.component';
import { ActasComponent } from './features/actas/actas.component';
import { NosotrosComponent } from './features/nosotros/nosotros.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: MuralComponent },
  { path: 'actas', component: ActasComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'administracion', component: AdminComponent, canActivate: [AuthGuard] }
];
