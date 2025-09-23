import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { IValidationService, ValidationResult } from '../interfaces/domain-services.interface';

// Single Responsibility Principle - Servicio dedicado exclusivamente a validaciones
@Injectable({
  providedIn: 'root'
})
export class ValidationService implements IValidationService {

  validateForm(form: FormGroup): ValidationResult {
    const errors: string[] = [];
    
    if (!form.valid) {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control && control.errors) {
          Object.keys(control.errors).forEach(errorKey => {
            errors.push(`${key}: ${this.getErrorMessage(errorKey, control.errors![errorKey])}`);
          });
        }
      });
    }
    
    return {
      isValid: form.valid,
      errors: errors
    };
  }

  private getErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return 'Este campo es requerido';
      case 'email':
        return 'Formato de email inválido';
      case 'minlength':
        return `Mínimo ${errorValue.requiredLength} caracteres`;
      case 'maxlength':
        return `Máximo ${errorValue.requiredLength} caracteres`;
      default:
        return 'Campo inválido';
    }
  }

  markAllFieldsAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsTouched();
        
        // Si es un FormGroup anidado, aplicar recursivamente
        if (control instanceof FormGroup) {
          this.markAllFieldsAsTouched(control);
        }
      }
    });
  }

  getFieldErrors(control: AbstractControl): string[] {
    const errors: string[] = [];
    
    if (control.errors) {
      if (control.errors['required']) {
        errors.push('Este campo es requerido');
      }
      if (control.errors['email']) {
        errors.push('Formato de email inválido');
      }
      if (control.errors['minlength']) {
        errors.push(`Mínimo ${control.errors['minlength'].requiredLength} caracteres`);
      }
      if (control.errors['maxlength']) {
        errors.push(`Máximo ${control.errors['maxlength'].requiredLength} caracteres`);
      }
      if (control.errors['pattern']) {
        errors.push('Formato inválido');
      }
    }
    
    return errors;
  }

  validateActa(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.titulo || data.titulo.trim().length === 0) {
      errors.push('El título es requerido');
    }
    
    if (!data.descripcion || data.descripcion.trim().length === 0) {
      errors.push('La descripción es requerida');
    }
    
    if (data.titulo && data.titulo.length > 200) {
      errors.push('El título no puede exceder 200 caracteres');
    }
    
    if (!data.fecha) {
      errors.push('La fecha es requerida');
    } else {
      const fecha = new Date(data.fecha);
      if (fecha > new Date()) {
        errors.push('La fecha no puede ser futura');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateCircular(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.titulo || data.titulo.trim().length === 0) {
      errors.push('El título es requerido');
    }
    
    if (!data.descripcion || data.descripcion.trim().length === 0) {
      errors.push('La descripción es requerida');
    }
    
    if (!data.categoria || data.categoria.trim().length === 0) {
      errors.push('La categoría es requerida');
    }
    
    if (data.titulo && data.titulo.length > 150) {
      errors.push('El título no puede exceder 150 caracteres');
    }
    
    if (data.fechaVencimiento) {
      const fechaVencimiento = new Date(data.fechaVencimiento);
      if (fechaVencimiento <= new Date()) {
        errors.push('La fecha de vencimiento debe ser futura');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[+]?[0-9]{8,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  sanitizeInput(input: string): string {
    // Remover caracteres potencialmente peligrosos
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim();
  }
}