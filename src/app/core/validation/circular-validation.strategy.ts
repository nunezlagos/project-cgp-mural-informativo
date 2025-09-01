import { Injectable } from '@angular/core';
import { ValidationStrategy, ValidationResult } from './validation-strategy.interface';
import { Circular } from '../models/circular.model';

@Injectable({
  providedIn: 'root'
})
export class CircularValidationStrategy implements ValidationStrategy<Circular> {
  validate(circular: Partial<Circular>): ValidationResult {
    const errors: string[] = [];

    // Validación del título
    if (!circular.titulo || circular.titulo.trim().length === 0) {
      errors.push('El título de la circular es requerido');
    } else if (circular.titulo.trim().length < 5) {
      errors.push('El título de la circular debe tener al menos 5 caracteres');
    } else if (circular.titulo.trim().length > 200) {
      errors.push('El título de la circular no puede exceder 200 caracteres');
    }

    // Validación del contenido
    if (!circular.cuerpo || circular.cuerpo.trim().length === 0) {
      errors.push('El contenido de la circular es requerido');
    } else if (circular.cuerpo.trim().length < 10) {
      errors.push('El contenido de la circular debe tener al menos 10 caracteres');
    } else if (circular.cuerpo.trim().length > 3000) {
      errors.push('El contenido de la circular no puede exceder 3000 caracteres');
    }

    // Validación del autor
    if (!circular.autor || circular.autor.trim().length === 0) {
      errors.push('El autor de la circular es requerido');
    } else if (circular.autor.trim().length < 2) {
      errors.push('El nombre del autor debe tener al menos 2 caracteres');
    } else if (circular.autor.trim().length > 100) {
      errors.push('El nombre del autor no puede exceder 100 caracteres');
    }

    // Validación del estado
    if (circular.status !== undefined && !['activo', 'inactivo'].includes(circular.status)) {
      errors.push('El estado de la circular debe ser "activo" o "inactivo"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}