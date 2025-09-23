import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Acta } from '../models/acta.model';
import { environment } from '../../../environments/environment';
import { BaseCrudService } from './base-crud.service';
import { IActasService } from '../interfaces/domain-services.interface';
import { IReactiveState } from '../interfaces/crud-operations.interface';

// Dependency Inversion Principle - Implementación de interfaces específicas
@Injectable({
  providedIn: 'root',
})
export class ActasService extends BaseCrudService<Acta> implements IActasService {
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

  // Implementación de IActasService - Single Responsibility Principle
  async getActasByDateRange(startDate: Date, endDate: Date): Promise<Acta[]> {
    try {
      const response = await fetch(`${this.baseUrl}/date-range?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting actas by date range:', error);
      throw error;
    }
  }

  async getActasByStatus(status: string): Promise<Acta[]> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting actas by status:', error);
      throw error;
    }
  }

  async approveActa(id: number): Promise<Acta> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/approve`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      this.notifyDataChange(); // Actualizar estado reactivo
      return result;
    } catch (error) {
      console.error('Error approving acta:', error);
      throw error;
    }
  }

  // Métodos requeridos por IActasService
  async getActasByAutor(autor: string): Promise<Acta[]> {
    try {
      const response = await fetch(`${this.baseUrl}?autor=${autor}`);
      if (!response.ok) {
        throw new Error('Error al obtener actas por autor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async searchActasByTitle(title: string): Promise<Acta[]> {
    try {
      const response = await fetch(`${this.baseUrl}?search=${encodeURIComponent(title)}`);
      if (!response.ok) {
        throw new Error('Error al buscar actas por título');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  getState(): Acta[] {
    // Implementación básica del estado reactivo
    return [];
  }

  updateState(data: Acta[]): void {
    // Implementación básica de actualización de estado
    console.log('Estado actualizado:', data);
  }

  // Hook methods - Template Method Pattern
  protected override beforeCreate(data: Partial<Acta>): Partial<Acta> {
    // Validaciones específicas para actas
    return {
      ...data,
      created_at: new Date().toISOString(),
      status: 'borrador'
    };
  }

  protected override afterCreate(acta: Acta): void {
    console.log(`Acta creada: ${acta.titulo}`);
    this.notifyDataChange();
  }

  protected override afterUpdate(acta: Acta): void {
    console.log(`Acta actualizada: ${acta.titulo}`);
    this.notifyDataChange();
  }

  protected override afterDelete(id: number): void {
    console.log(`Acta eliminada con ID: ${id}`);
    this.notifyDataChange();
  }

  private notifyDataChange(): void {
    // Método para notificar cambios en los datos
    // Aquí se puede implementar lógica para actualizar señales o notificar componentes
  }
}
