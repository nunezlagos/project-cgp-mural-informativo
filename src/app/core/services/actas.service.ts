import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Acta } from '../models/acta.model'; // Importamos el modelo Acta
import { environment } from '../../../environments/environment'; // Importamos el entorno

@Injectable({
  providedIn: 'root',
})
export class ActasService {
  private baseUrl = `${environment.apiUrl}/api/v1/actas`; // Usamos la URL de la API desde el entorno

  actas$ = signal<Acta[]>([]);

  constructor(private http: HttpClient) {}

  async getAll(): Promise<Acta[]> {
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

  async getById(id: number) {
    try {
      const acta = await this.http.get<Acta>(`${this.baseUrl}/${id}`).toPromise();
      return acta;
    } catch (error) {
      console.error(`Error al obtener acta con ID ${id}:`, error);
      return null;
    }
  }

  async create(acta: Acta) {
    try {
      await this.http.post(this.baseUrl, acta).toPromise();
      await this.getAll();  // Recargamos los datos después de la creación
    } catch (error) {
      console.error('Error al crear acta:', error);
    }
  }

  async update(id: number, acta: Acta) {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, acta).toPromise();
      await this.getAll();  // Recargamos los datos después de la actualización
    } catch (error) {
      console.error('Error al actualizar acta:', error);
    }
  }

  async delete(id: number) {
    try {
      console.log(`Enviando solicitud para eliminar la acta con ID: ${id}`);
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      console.log(`El acta con ID: ${id} ha sido eliminada exitosamente.`);

      // Recargar los datos
      await this.getAll();
      console.log('Datos recargados después de la eliminación.');
    } catch (error) {
      console.error('Error al eliminar acta:', error);
    }
  }

}
