import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Importa RouterModule
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,  // Marca el AppComponent como standalone
  imports: [NavbarComponent, FooterComponent, RouterModule],  // Importa RouterModule para manejar las rutas
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
