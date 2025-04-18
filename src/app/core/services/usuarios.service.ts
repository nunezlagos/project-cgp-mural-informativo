import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model'; // Importamos el modelo Usuario
import { environment } from '../../../environments/environment'; // Importamos el entorno

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = `${environment.apiUrl}/api/v1/usuarios`; // Usamos la URL de la API desde el entorno

  usuarios$ = signal<Usuario[]>([]);

  constructor(private http: HttpClient) {}

  async getAll() {
    try {
      const usuarios = await this.http.get<Usuario[]>(this.baseUrl).toPromise();
      this.usuarios$.set(usuarios || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  }

  async getById(id: number) {
    try {
      const usuario = await this.http.get<Usuario>(`${this.baseUrl}/${id}`).toPromise();
      return usuario;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
    }
  }

  async create(usuario: Usuario) {
    try {
      await this.http.post(this.baseUrl, usuario).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  }

  async update(id: number, usuario: Usuario) {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, usuario).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  }

  async delete(id: number) {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }
}
