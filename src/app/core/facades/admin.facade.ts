import { Injectable } from '@angular/core';
import { ActasService } from '../services/actas.service';
import { CircularesService } from '../services/circulares.service';
import { Acta } from '../models/acta.model';
import { Circular } from '../models/circular.model';
import { FormValidatorService } from '../validation/form-validator.service';
import { ValidationResult } from '../validation/validation-strategy.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminFacade {
  constructor(
    private actasService: ActasService,
    private circularesService: CircularesService,
    private formValidatorService: FormValidatorService
  ) {}

  // Métodos para cargar datos
  async loadAllData(): Promise<{ actas: Acta[], circulares: Circular[] }> {
    try {
      const [actas, circulares] = await Promise.all([
        this.actasService.getAll(),
        this.circularesService.getAll()
      ]);
      return { actas, circulares };
    } catch (error) {
      console.error('Error al cargar datos:', error);
      throw error;
    }
  }

  async loadActas(): Promise<Acta[]> {
    return this.actasService.getAll();
  }

  async loadCirculares(): Promise<Circular[]> {
    return this.circularesService.getAll();
  }

  // Métodos para Actas
  async getActaById(id: number): Promise<Acta> {
    return this.actasService.getById(id);
  }

  async saveActa(acta: Partial<Acta>, isEdit: boolean = false): Promise<Acta> {
    if (isEdit && acta.id) {
      return this.actasService.update(acta.id, acta);
    } else {
      return this.actasService.create(acta);
    }
  }

  async deleteActa(id: number): Promise<void> {
    return this.actasService.delete(id);
  }

  // Métodos para Circulares
  async getCircularById(id: number): Promise<Circular> {
    return this.circularesService.getById(id);
  }

  async saveCircular(circular: Partial<Circular>, isEdit: boolean = false): Promise<Circular> {
    if (isEdit && circular.id) {
      return this.circularesService.update(circular.id, circular);
    } else {
      return this.circularesService.create(circular);
    }
  }

  async deleteCircular(id: number): Promise<void> {
    return this.circularesService.delete(id);
  }

  // Métodos de utilidad
  getActasSignal() {
    return this.actasService.actas$;
  }

  getCircularesSignal() {
    return this.circularesService.circulares$;
  }

  // Métodos de validación usando Strategy pattern
  validateActa(acta: Partial<Acta>): ValidationResult {
    return this.formValidatorService.validateActa(acta);
  }

  validateCircular(circular: Partial<Circular>): ValidationResult {
    return this.formValidatorService.validateCircular(circular);
  }

  // Método para validar y guardar con manejo de errores
  async validateAndSaveActa(acta: Partial<Acta>, isEdit: boolean = false): Promise<{ success: boolean, data?: Acta, errors?: string[] }> {
    const validation = this.validateActa(acta);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      const savedActa = await this.saveActa(acta, isEdit);
      return {
        success: true,
        data: savedActa
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Error al guardar el acta. Por favor, intente nuevamente.']
      };
    }
  }

  async validateAndSaveCircular(circular: Partial<Circular>, isEdit: boolean = false): Promise<{ success: boolean, data?: Circular, errors?: string[] }> {
    const validation = this.validateCircular(circular);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      const savedCircular = await this.saveCircular(circular, isEdit);
      return {
        success: true,
        data: savedCircular
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Error al guardar la circular. Por favor, intente nuevamente.']
      };
    }
  }
}