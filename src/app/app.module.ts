import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Importa AppRoutingModule

// Importa los componentes
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthComponent } from './features/auth/auth.component';
import { HttpClientModule } from '@angular/common/http';


// AppModule ahora solo importa los módulos necesarios.
@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: []
})
export class AppModule {}
