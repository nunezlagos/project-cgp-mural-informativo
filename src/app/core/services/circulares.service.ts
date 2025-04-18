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

  async getAll() {
    try {
      const circulares = await this.http.get<Circular[]>(this.baseUrl).toPromise();
      this.circulares$.set(circulares || []);
    } catch (error) {
      console.error('Error al obtener circulares:', error);
    }
  }

  async getById(id: number) {
    try {
      const circular = await this.http.get<Circular>(`${this.baseUrl}/${id}`).toPromise();
      return circular;
    } catch (error) {
      console.error(`Error al obtener circular con ID ${id}:`, error);
    }
  }

  async create(circular: Circular) {
    try {
      await this.http.post(this.baseUrl, circular).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al crear circular:', error);
    }
  }

  async update(id: number, circular: Circular) {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, circular).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al actualizar circular:', error);
    }
  }

  async delete(id: number) {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al eliminar circular:', error);
    }
  }
}
