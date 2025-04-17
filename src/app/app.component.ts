// app.component.ts
import { Component } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MuralComponent } from './features/mural/mural.component';




@Component({
  selector: 'app-root',
  standalone: true,  // Marca el AppComponent como standalone
  imports: [NavbarComponent, MuralComponent, FooterComponent],  // Importa los componentes standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
