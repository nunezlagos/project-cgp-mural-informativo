import { Injectable } from '@angular/core';
import { ValidationStrategy, ValidationResult } from './validation-strategy.interface';
import { ActaValidationStrategy } from './acta-validation.strategy';
import { CircularValidationStrategy } from './circular-validation.strategy';
import { Acta } from '../models/acta.model';
import { Circular } from '../models/circular.model';

export enum ValidationType {
  ACTA = 'acta',
  CIRCULAR = 'circular'
}

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {
  private strategies: Map<ValidationType, ValidationStrategy<any>> = new Map();

  constructor(
    private actaValidationStrategy: ActaValidationStrategy,
    private circularValidationStrategy: CircularValidationStrategy
  ) {
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    this.strategies.set(ValidationType.ACTA, this.actaValidationStrategy);
    this.strategies.set(ValidationType.CIRCULAR, this.circularValidationStrategy);
  }

  validateActa(acta: Partial<Acta>): ValidationResult {
    const strategy = this.strategies.get(ValidationType.ACTA);
    if (!strategy) {
      throw new Error('Estrategia de validación para Acta no encontrada');
    }
    return strategy.validate(acta);
  }

  validateCircular(circular: Partial<Circular>): ValidationResult {
    const strategy = this.strategies.get(ValidationType.CIRCULAR);
    if (!strategy) {
      throw new Error('Estrategia de validación para Circular no encontrada');
    }
    return strategy.validate(circular);
  }

  validate<T>(type: ValidationType, data: Partial<T>): ValidationResult {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Estrategia de validación para ${type} no encontrada`);
    }
    return strategy.validate(data);
  }

  // Método para registrar nuevas estrategias dinámicamente
  registerStrategy<T>(type: ValidationType, strategy: ValidationStrategy<T>): void {
    this.strategies.set(type, strategy);
  }

  // Método para obtener todas las estrategias disponibles
  getAvailableStrategies(): ValidationType[] {
    return Array.from(this.strategies.keys());
  }
}