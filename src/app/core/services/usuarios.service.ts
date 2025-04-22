import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = `https://cgp-worker.asistente-nunez.workers.dev/api/v1/usuarios`;

  constructor(private http: HttpClient) {}

  private async sha256Twice(text: string): Promise<string> {
    try {
      console.log('Texto recibido:', text);
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const firstHashBuffer = await crypto.subtle.digest('SHA-256', data);
      console.log('Primer hash generado');

      const secondHashBuffer = await crypto.subtle.digest('SHA-256', firstHashBuffer);
      console.log('Segundo hash generado');

      const hashFinal = Array.from(new Uint8Array(secondHashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      console.log('Hash final:', hashFinal);
      return hashFinal;
    } catch (error) {
      console.error('Error al generar el hash:', error);
      throw error;
    }
  }


  /** LOGIN */
  async login(usuario: string, contrasena: string): Promise<boolean> {
    try {
      const hash = await this.sha256Twice(contrasena); // Hash de la contraseña ingresada
      console.log('Contraseña ingresada:', contrasena);
      console.log('Hash de la contraseña ingresada:', hash);

      const response = await firstValueFrom(this.http.get<{ results: Usuario[] }>(this.baseUrl));
      console.log('Respuesta de la API:', response);

      const usuarios = response.results; // Ahora accedemos a 'results' para obtener los usuarios
      console.log('Usuarios obtenidos:', usuarios);

      const user = usuarios.find(u => u.usuario === usuario);
      console.log('Usuario encontrado:', user);

      if (user) {
        // Hash de la contraseña almacenada en la base de datos
        console.log('Hash de la contraseña en la base de datos:', user.contrasena);

        // Verifica si los dos hashes coinciden
        const isPasswordValid = user.contrasena === hash;
        console.log('Las contraseñas coinciden:', isPasswordValid);

        if (isPasswordValid) {
          localStorage.setItem('usuario', JSON.stringify(user));
          console.log('Login exitoso');
          return true;
        }
      }

      console.log('Usuario no encontrado o las contraseñas no coinciden');
      return false; // Si no se encuentra el usuario o los hashes no coinciden
    } catch (error) {
      console.error('Error al autenticar:', error);
      return false;
    }
  }


  /** LOGOUT */
  logout() {
    localStorage.removeItem('usuario');
  }

  /** GET localStorage usuario */
  getUsuarioAutenticado(): Usuario | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  /** BOOLEAN si está autenticado */
  estaAutenticado(): boolean {
    return !!this.getUsuarioAutenticado();
  }

  /** OBTENER todos los usuarios */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  /** OBTENER usuario por ID */
  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  /** CREAR nuevo usuario */
  async crearUsuario(usuario: string, contrasena: string): Promise<any> {
    const hash = await this.sha256Twice(contrasena);
    return firstValueFrom(this.http.post(this.baseUrl, { usuario, contrasena: hash }));
  }

  /** ACTUALIZAR usuario */
  async actualizarUsuario(id: number, usuario: string, contrasena: string): Promise<any> {
    const hash = await this.sha256Twice(contrasena);
    return firstValueFrom(this.http.put(`${this.baseUrl}/${id}`, { usuario, contrasena: hash }));
  }

  /** ELIMINAR usuario */
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('usuario');  // Ahora verifica si hay un usuario guardado en localStorage
  }
}
