import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule si no lo has hecho.
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule.
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../../../features/auth/auth.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  constructor(public dialog: MatDialog) {}

  openLoginModal() {
    this.dialog.open(AuthComponent, {
      width: '400px'
    });
  }
}
