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

  async getAll() {
    try {
      const actas = await this.http.get<Acta[]>(this.baseUrl).toPromise();
      this.actas$.set(actas || []);
    } catch (error) {
      console.error('Error al obtener actas:', error);
    }
  }

  async getById(id: number) {
    try {
      const acta = await this.http.get<Acta>(`${this.baseUrl}/${id}`).toPromise();
      return acta;
    } catch (error) {
      console.error(`Error al obtener acta con ID ${id}:`, error);
    }
  }

  async create(acta: Acta) {
    try {
      await this.http.post(this.baseUrl, acta).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al crear acta:', error);
    }
  }

  async update(id: number, acta: Acta) {
    try {
      await this.http.put(`${this.baseUrl}/${id}`, acta).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al actualizar acta:', error);
    }
  }

  async delete(id: number) {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      this.getAll();
    } catch (error) {
      console.error('Error al eliminar acta:', error);
    }
  }
}
