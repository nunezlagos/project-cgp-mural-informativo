// Single Responsibility Principle - Servicio específico para manejo de formularios
// Dependency Inversion Principle - Depende de abstracciones (ValidationService)

import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Acta } from '../models/acta.model';
import { Circular } from '../models/circular.model';
import { ValidationService } from './validation.service';
import { ValidationResult } from '../interfaces/domain-services.interface';

export interface FormField {
  name: string;
  value: any;
  validators?: any[];
}

export interface FormConfig {
  titulo: string;
  autor: string;
  cuerpo: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormManagementService {
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);

  /**
   * Crea un formulario vacío para nueva entidad
   */
  createEmptyForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      autor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cuerpo: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  /**
   * Crea un formulario pre-poblado para edición
   */
  createEditForm(data: Partial<Acta | Circular>): FormGroup {
    return this.fb.group({
      titulo: [data.titulo || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      autor: [data.autor || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cuerpo: [data.cuerpo || '', [Validators.required, Validators.minLength(10)]],
    });
  }

  /**
   * Valida un formulario usando el ValidationService
   */
  validateForm(form: FormGroup): ValidationResult {
    // Delegar validación al ValidationService - Dependency Inversion Principle
    return this.validationService.validateForm(form);
  }

  /**
   * Resetea un formulario a su estado inicial
   */
  resetForm(form: FormGroup): void {
    form.reset();
    form.markAsUntouched();
    form.markAsPristine();
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  markAllFieldsAsTouched(form: FormGroup): void {
    // Delegar al ValidationService - Single Responsibility Principle
    this.validationService.markAllFieldsAsTouched(form);
  }

  /**
   * Obtiene el nombre de visualización para un campo
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'titulo': 'Título',
      'autor': 'Autor',
      'cuerpo': 'Contenido'
    };
    return displayNames[fieldName] || fieldName;
  }

  /**
   * Extrae los datos del formulario
   */
  extractFormData(form: FormGroup): FormConfig {
    return {
      titulo: form.get('titulo')?.value || '',
      autor: form.get('autor')?.value || '',
      cuerpo: form.get('cuerpo')?.value || ''
    };
  }
}