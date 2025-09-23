import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Circular } from '../models/circular.model';
import { environment } from '../../../environments/environment';
import { BaseCrudService } from './base-crud.service';
import { ICircularesService } from '../interfaces/domain-services.interface';
import { IReactiveState } from '../interfaces/crud-operations.interface';

// Dependency Inversion Principle - Implementación de interfaces específicas
@Injectable({
  providedIn: 'root',
})
export class CircularesService extends BaseCrudService<Circular> implements ICircularesService {
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

  // Implementación de ICircularesService - Single Responsibility Principle
  async getCircularesByCategory(category: string): Promise<Circular[]> {
    try {
      const response = await fetch(`${this.baseUrl}/category/${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting circulares by category:', error);
      throw error;
    }
  }

  async getActiveCirculares(): Promise<Circular[]> {
    try {
      const response = await fetch(`${this.baseUrl}/active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting active circulares:', error);
      throw error;
    }
  }

  async publishCircular(id: number): Promise<Circular> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/publish`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      this.notifyDataChange(); // Actualizar estado reactivo
      return result;
    } catch (error) {
      console.error('Error publishing circular:', error);
      throw error;
    }
  }

  async archiveCircular(id: number): Promise<Circular> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al archivar circular');
      }
      const result = await response.json();
      this.notifyDataChange(); // Actualizar estado reactivo
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Métodos requeridos por ICircularesService
  async getCircularesByAutor(autor: string): Promise<Circular[]> {
    try {
      const response = await fetch(`${this.baseUrl}?autor=${autor}`);
      if (!response.ok) {
        throw new Error('Error al obtener circulares por autor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getCircularesByDateRange(startDate: Date, endDate: Date): Promise<Circular[]> {
    try {
      const response = await fetch(`${this.baseUrl}?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
      if (!response.ok) {
        throw new Error('Error al obtener circulares por rango de fechas');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async searchCircularesByTitle(title: string): Promise<Circular[]> {
    try {
      const response = await fetch(`${this.baseUrl}?search=${encodeURIComponent(title)}`);
      if (!response.ok) {
        throw new Error('Error al buscar circulares por título');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  getState(): Circular[] {
    // Implementación básica del estado reactivo
    return [];
  }

  updateState(data: Circular[]): void {
    // Implementación básica de actualización de estado
    console.log('Estado actualizado:', data);
  }

  // Hook methods - Template Method Pattern
  protected override beforeCreate(data: Partial<Circular>): Partial<Circular> {
    // Validaciones específicas para circulares
    return {
        ...data,
        created_at: new Date().toISOString(),
        status: 'borrador'
      };
  }

  protected override afterCreate(circular: Circular): void {
    console.log(`Circular creada: ${circular.titulo}`);
    this.notifyDataChange();
  }

  protected override afterUpdate(circular: Circular): void {
    console.log(`Circular actualizada: ${circular.titulo}`);
    this.notifyDataChange();
  }

  protected override afterDelete(id: number): void {
    console.log(`Circular eliminada con ID: ${id}`);
    this.notifyDataChange();
  }

  private notifyDataChange(): void {
    // Método para notificar cambios en los datos
    // Aquí se puede implementar lógica para actualizar señales o notificar componentes
  }
}
