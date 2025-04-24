import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UsuarioService } from '../../core/services/usuarios.service';
import { Router } from '@angular/router'; // Importamos Router
import { MatDialogRef } from '@angular/material/dialog'; // Importamos MatDialogRef

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    NgIf
  ]
})
export class AuthComponent {
  usuario: string = '';
  contrasena: string = '';
  errorLogin: boolean = false;
  cargando?: any;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private dialogRef: MatDialogRef<AuthComponent>
  ) {}

  async onLoginSubmit() {
    this.errorLogin = false;
    this.cargando = true;

    const exito = await this.usuarioService.login(this.usuario, this.contrasena);

    this.cargando = false;

    if (!exito) {
      this.errorLogin = true;
    } else {
      console.log('Login exitoso');
      // Cerrar el modal
      this.dialogRef.close();
      this.router.navigate(['/administracion']);
    }
  }
}
