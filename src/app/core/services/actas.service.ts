import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Acta } from '../models/acta.model'; // Importamos el modelo Acta
import { environment } from '../../../environments/environment'; // Importamos el entorno
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ActasService extends BaseCrudService<Acta> {
  protected baseUrl = `https://cgp-worker.asistente-nunez.workers.dev/api/v1/actas`; // Usamos la URL de la API desde el entorno

  actas$ = signal<Acta[]>([]);

  constructor(http: HttpClient) {
    super(http);
  }

  override async getAll(): Promise<Acta[]> {
    try {
      // Usamos '?.' para acceder a 'results' y asignamos un arreglo vacío por defecto
      const response = await this.http.get<{ results: Acta[] }>(this.baseUrl).toPromise();
      const actas = response?.results || [];  // Si response o results es undefined, asignamos un arreglo vacío
      this.actas$.set(actas);  // Actualizamos el estado de actas
      return actas;
    } catch (error) {
      console.error('Error al obtener actas:', error);
      return [];  // Retorna un arreglo vacío en caso de error
    }
  }

  override async getById(id: number): Promise<Acta> {
    try {
      const acta = await this.http.get<Acta>(`${this.baseUrl}/${id}`).toPromise();
      return acta || {} as Acta;
    } catch (error) {
      console.error(`Error al obtener acta con ID ${id}:`, error);
      throw error;
    }
  }

  override async create(acta: Partial<Acta>): Promise<Acta> {
    try {
      const result = await this.http.post<Acta>(this.baseUrl, acta).toPromise();
      await this.getAll();  // Recargamos los datos después de la creación
      return result || {} as Acta;
    } catch (error) {
      console.error('Error al crear acta:', error);
      throw error;
    }
  }

  override async update(id: number, acta: Partial<Acta>): Promise<Acta> {
    try {
      const result = await this.http.put<Acta>(`${this.baseUrl}/${id}`, acta).toPromise();
      await this.getAll();  // Recargamos los datos después de la actualización
      return result || {} as Acta;
    } catch (error) {
      console.error('Error al actualizar acta:', error);
      throw error;
    }
  }

  override async delete(id: number): Promise<void> {
    try {
      console.log(`Enviando solicitud para eliminar la acta con ID: ${id}`);
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      console.log(`El acta con ID: ${id} ha sido eliminada exitosamente.`);

      // Recargar los datos
      await this.getAll();
      console.log('Datos recargados después de la eliminación.');
    } catch (error) {
      console.error('Error al eliminar acta:', error);
      throw error;
    }
  }

  protected getEntityName(): string {
    return 'acta';
  }
}
