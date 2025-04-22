// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuarios.service';  // Asegúrate de importar el servicio correcto

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.usuarioService.isAuthenticated()) {
      return true;
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/']); // Redirige al inicio o a la ruta de login que prefieras
      return false;
    }
  }
}
