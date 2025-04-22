import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Circular } from '../models/circular.model'; // Importamos el modelo Circular
import { environment } from '../../../environments/environment'; // Importamos el entorno

@Injectable({
  providedIn: 'root',
})
export class CircularesService {
  private baseUrl = `${environment.apiUrl}/api/v1/circulares`; // Usamos la URL de la API desde el entorno

  circulares$ = signal<Circular[]>([]);

  constructor(private http: HttpClient) {}

  async getAll(): Promise<Circular[]> {
    try {
      // Usamos '?.' para acceder a 'results' y asignamos un arreglo vacío por defecto
      const response = await this.http.get<{ results: Circular[] }>(this.baseUrl).toPromise();
      const circulares = response?.results || [];  // Si response o results es undefined, asignamos un arreglo vacío
      this.circulares$.set(circulares);  // Actualizamos el estado de circulares
      return circulares;
    } catch (error) {
      console.error('Error al obtener circulares:', error);
      return [];  // Retorna un arreglo vacío en caso de error
    }
  }

  async getById(id: number) {
    try {
      const circular = await this.http.get<Circular>(`${this.baseUrl}/${id}`).toPromise();
      return circular;
    } catch (error) {
      console.error(`Error al obtener circular con ID ${id}:`, error);
      return null;
    }
  }

  async create(circular: Circular) {
    try {
      await this.http.post(this.baseUrl, circular).toPromise();
      await this.getAll();  // Recargamos los datos después de la creación
    } catch (error) {
      console.error('Error al crear circular:', error);
    }
  }

  async update(id: number, circular: Circular) {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, circular).toPromise();
      await this.getAll();  // Recargamos los datos después de la actualización
    } catch (error) {
      console.error('Error al actualizar circular:', error);
    }
  }

  async delete(id: number) {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      await this.getAll();  // Recargamos los datos después de la eliminación
    } catch (error) {
      console.error('Error al eliminar circular:', error);
    }
  }
}
