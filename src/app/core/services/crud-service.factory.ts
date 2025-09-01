import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActasService } from './actas.service';
import { CircularesService } from './circulares.service';
import { BaseCrudService } from './base-crud.service';
import { Acta } from '../models/acta.model';
import { Circular } from '../models/circular.model';

@Injectable({
  providedIn: 'root'
})
export class CrudServiceFactory {
  constructor(private http: HttpClient) {}
  
  createActasService(): ActasService {
    return new ActasService(this.http);
  }
  
  createCircularesService(): CircularesService {
    return new CircularesService(this.http);
  }
  
  createService<T>(type: 'acta' | 'circular'): BaseCrudService<T> {
    switch (type) {
      case 'acta':
        return this.createActasService() as BaseCrudService<T>;
      case 'circular':
        return this.createCircularesService() as BaseCrudService<T>;
      default:
        throw new Error(`Unknown service type: ${type}`);
    }
  }
  
  // Método para obtener el servicio apropiado basado en el tipo
  getServiceForType(type: 'acta' | 'circular'): BaseCrudService<Acta | Circular> {
    return this.createService(type);
  }
  
  // Método para crear múltiples servicios a la vez
  createAllServices(): { actasService: ActasService, circularesService: CircularesService } {
    return {
      actasService: this.createActasService(),
      circularesService: this.createCircularesService()
    };
  }
}