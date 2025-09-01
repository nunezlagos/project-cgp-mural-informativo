import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Circular } from '../models/circular.model'; // Importamos el modelo Circular
import { environment } from '../../../environments/environment'; // Importamos el entorno
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class CircularesService extends BaseCrudService<Circular> {
  protected baseUrl = `https://cgp-worker.asistente-nunez.workers.dev/api/v1/circulares`; // Usamos la URL de la API desde el entorno

  circulares$ = signal<Circular[]>([]);

  constructor(http: HttpClient) {
    super(http);
  }

  override async getAll(): Promise<Circular[]> {
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

  override async getById(id: number): Promise<Circular> {
    try {
      const circular = await this.http.get<Circular>(`${this.baseUrl}/${id}`).toPromise();
      return circular || {} as Circular;
    } catch (error) {
      console.error(`Error al obtener circular con ID ${id}:`, error);
      throw error;
    }
  }

  override async create(circular: Partial<Circular>): Promise<Circular> {
    try {
      const result = await this.http.post<Circular>(this.baseUrl, circular).toPromise();
      await this.getAll();  // Recargamos los datos después de la creación
      return result || {} as Circular;
    } catch (error) {
      console.error('Error al crear circular:', error);
      throw error;
    }
  }

  override async update(id: number, circular: Partial<Circular>): Promise<Circular> {
    try {
      const result = await this.http.put<Circular>(`${this.baseUrl}/${id}`, circular).toPromise();
      await this.getAll();  // Recargamos los datos después de la actualización
      return result || {} as Circular;
    } catch (error) {
      console.error('Error al actualizar circular:', error);
      throw error;
    }
  }

  override async delete(id: number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      await this.getAll();  // Recargamos los datos después de la eliminación
    } catch (error) {
      console.error('Error al eliminar circular:', error);
      throw error;
    }
  }

  protected getEntityName(): string {
    return 'circular';
  }
}
