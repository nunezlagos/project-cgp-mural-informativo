import { Injectable } from '@angular/core';
import { ValidationStrategy, ValidationResult } from './validation-strategy.interface';
import { Acta } from '../models/acta.model';

@Injectable({
  providedIn: 'root'
})
export class ActaValidationStrategy implements ValidationStrategy<Acta> {
  validate(acta: Partial<Acta>): ValidationResult {
    const errors: string[] = [];

    // Validación del título
    if (!acta.titulo || acta.titulo.trim().length === 0) {
      errors.push('El título del acta es requerido');
    } else if (acta.titulo.trim().length < 5) {
      errors.push('El título del acta debe tener al menos 5 caracteres');
    } else if (acta.titulo.trim().length > 200) {
      errors.push('El título del acta no puede exceder 200 caracteres');
    }

    // Validación del contenido
    if (!acta.cuerpo || acta.cuerpo.trim().length === 0) {
      errors.push('El contenido del acta es requerido');
    } else if (acta.cuerpo.trim().length < 20) {
      errors.push('El contenido del acta debe tener al menos 20 caracteres');
    } else if (acta.cuerpo.trim().length > 5000) {
      errors.push('El contenido del acta no puede exceder 5000 caracteres');
    }

    // Validación del autor
    if (!acta.autor || acta.autor.trim().length === 0) {
      errors.push('El autor del acta es requerido');
    } else if (acta.autor.trim().length < 2) {
      errors.push('El nombre del autor debe tener al menos 2 caracteres');
    } else if (acta.autor.trim().length > 100) {
      errors.push('El nombre del autor no puede exceder 100 caracteres');
    }

    // Validación del estado
    if (acta.status !== undefined && !['activo', 'inactivo'].includes(acta.status)) {
      errors.push('El estado del acta debe ser "activo" o "inactivo"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}