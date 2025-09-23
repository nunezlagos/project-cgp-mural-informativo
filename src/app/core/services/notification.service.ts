import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INotificationService } from '../interfaces/domain-services.interface';

export interface NotificationConfig {
  duration?: number;
  action?: string;
  panelClass?: string[];
}

// Single Responsibility Principle - Servicio dedicado exclusivamente a notificaciones
@Injectable({
  providedIn: 'root'
})
export class NotificationService implements INotificationService {

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, config?: NotificationConfig): void {
    this.snackBar.open(message, config?.action || 'Cerrar', {
      duration: config?.duration || 3000,
      panelClass: ['success-snackbar', ...(config?.panelClass || [])]
    });
  }

  showError(message: string, config?: NotificationConfig): void {
    this.snackBar.open(message, config?.action || 'Cerrar', {
      duration: config?.duration || 5000,
      panelClass: ['error-snackbar', ...(config?.panelClass || [])]
    });
  }

  showWarning(message: string, config?: NotificationConfig): void {
    this.snackBar.open(message, config?.action || 'Cerrar', {
      duration: config?.duration || 4000,
      panelClass: ['warning-snackbar', ...(config?.panelClass || [])]
    });
  }

  showInfo(message: string, config?: NotificationConfig): void {
    this.snackBar.open(message, config?.action || 'Cerrar', {
      duration: config?.duration || 3000,
      panelClass: ['info-snackbar', ...(config?.panelClass || [])]
    });
  }

  // Métodos específicos para operaciones CRUD
  notifyCreateSuccess(entityName: string): void {
    this.showSuccess(`${entityName} creado exitosamente`);
  }

  notifyUpdateSuccess(entityName: string): void {
    this.showSuccess(`${entityName} actualizado exitosamente`);
  }

  notifyDeleteSuccess(entityName: string): void {
    this.showSuccess(`${entityName} eliminado exitosamente`);
  }

  notifyCreateError(entityName: string, error?: string): void {
    const message = error ? `Error al crear ${entityName}: ${error}` : `Error al crear ${entityName}`;
    this.showError(message);
  }

  notifyUpdateError(entityName: string, error?: string): void {
    const message = error ? `Error al actualizar ${entityName}: ${error}` : `Error al actualizar ${entityName}`;
    this.showError(message);
  }

  notifyDeleteError(entityName: string, error?: string): void {
    const message = error ? `Error al eliminar ${entityName}: ${error}` : `Error al eliminar ${entityName}`;
    this.showError(message);
  }

  notifyValidationError(errors: string[]): void {
    const message = errors.length === 1 
      ? errors[0] 
      : `Se encontraron ${errors.length} errores de validación`;
    this.showError(message);
  }

  notifyNetworkError(): void {
    this.showError('Error de conexión. Verifique su conexión a internet.');
  }

  notifyUnauthorized(): void {
    this.showError('No tiene permisos para realizar esta acción.');
  }

  notifyServerError(): void {
    this.showError('Error interno del servidor. Intente nuevamente más tarde.');
  }

  // Método para cerrar todas las notificaciones
  dismissAll(): void {
    this.snackBar.dismiss();
  }

  // Método para mostrar notificaciones personalizadas con acciones
  showWithAction(message: string, actionText: string, callback: () => void, config?: NotificationConfig): void {
    const snackBarRef = this.snackBar.open(message, actionText, {
      duration: config?.duration || 5000,
      panelClass: config?.panelClass || []
    });

    snackBarRef.onAction().subscribe(() => {
      callback();
    });
  }

  // Método para notificaciones de progreso
  showProgress(message: string): void {
    this.snackBar.open(message, '', {
      panelClass: ['progress-snackbar']
      // Sin duración para que permanezca hasta ser cerrada manualmente
    });
  }
}