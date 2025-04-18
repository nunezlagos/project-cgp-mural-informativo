// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuralComponent } from './features/mural/mural.component';

const routes: Routes = [
  { path: 'mural', component: MuralComponent },
  { path: '', redirectTo: '/mural', pathMatch: 'full' }  // ruta por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
