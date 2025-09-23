// Interface Segregation Principle - Interfaces específicas para servicios de dominio

import { Acta } from '../models/acta.model';
import { Circular } from '../models/circular.model';
import { ICrudOperations, IReactiveState } from './crud-operations.interface';

/**
 * Interface específica para el servicio de Actas
 * Separa las responsabilidades específicas del dominio
 */
export interface IActasService extends ICrudOperations<Acta>, IReactiveState<Acta> {
  // Métodos específicos del dominio de Actas
  getActasByAutor(autor: string): Promise<Acta[]>;
  getActasByDateRange(startDate: Date, endDate: Date): Promise<Acta[]>;
  searchActasByTitle(title: string): Promise<Acta[]>;
}

/**
 * Interface específica para el servicio de Circulares
 * Separa las responsabilidades específicas del dominio
 */
export interface ICircularesService extends ICrudOperations<Circular>, IReactiveState<Circular> {
  // Métodos específicos del dominio de Circulares
  getCircularesByAutor(autor: string): Promise<Circular[]>;
  getCircularesByDateRange(startDate: Date, endDate: Date): Promise<Circular[]>;
  searchCircularesByTitle(title: string): Promise<Circular[]>;
}

/**
 * Interface para operaciones de administración
 * Separa las responsabilidades administrativas
 */
export interface IAdminOperations {
  loadAllData(): Promise<{ actas: Acta[], circulares: Circular[] }>;
  exportData(format: 'json' | 'csv' | 'pdf'): Promise<Blob>;
  importData(data: any[]): Promise<{ success: boolean; errors?: string[] }>;
}

/**
 * Interface para operaciones de validación
 * Separa las responsabilidades de validación
 */
export interface IValidationOperations {
  validateActa(acta: Partial<Acta>): { isValid: boolean; errors: string[] };
  validateCircular(circular: Partial<Circular>): { isValid: boolean; errors: string[] };
}

export interface IValidationService {
  validateForm(form: any): ValidationResult;
  markAllFieldsAsTouched(form: any): void;
  getFieldErrors(form: any, fieldName: string): string[];
  validateActa(acta: any): ValidationResult;
  validateCircular(circular: any): ValidationResult;
  validateEmail(email: string): boolean;
  validatePhoneNumber(phone: string): boolean;
  sanitizeInput(input: string): string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface NotificationConfig {
  message: string;
  title?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  text: string;
  action: () => void;
}

export interface INotificationService {
  showSuccess(message: string, title?: string): void;
  showError(message: string, title?: string): void;
  showWarning(message: string, title?: string): void;
  showInfo(message: string, title?: string): void;
  
  // Métodos específicos para operaciones CRUD
  showCreateSuccess(entityName: string): void;
  showUpdateSuccess(entityName: string): void;
  showDeleteSuccess(entityName: string): void;
  
  // Métodos para errores específicos
  showValidationError(errors: string[]): void;
  showNetworkError(): void;
  showUnauthorizedError(): void;
  showServerError(): void;
  
  // Métodos de control
  closeAll(): void;
  closeNotification(id: string): void;
  
  // Métodos avanzados
  showCustomNotification(config: NotificationConfig): void;
  showNotificationWithAction(message: string, actionText: string, action: () => void): void;
  showProgressNotification(message: string, progress: number): void;
}

/**
 * Interface para operaciones de notificación
 * Separa las responsabilidades de notificación
 */
export interface INotificationOperations {
  notifyCreation(entityType: 'acta' | 'circular', entityId: number): void;
  notifyUpdate(entityType: 'acta' | 'circular', entityId: number): void;
  notifyDeletion(entityType: 'acta' | 'circular', entityId: number): void;
}