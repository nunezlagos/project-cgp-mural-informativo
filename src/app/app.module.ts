import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Importa los componentes autónomos
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthComponent } from './features/auth/auth.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    // Importa los componentes autónomos en el módulo
    NavbarComponent,
    FooterComponent,
    AuthComponent,
  ],
  providers: [],
  // Elimina la propiedad 'bootstrap' ya que no es compatible con componentes autónomos
})
export class AppModule { }
