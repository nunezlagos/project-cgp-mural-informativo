// Single Responsibility Principle - Servicio específico para manejo de diálogos

import { Injectable, TemplateRef, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ConfirmDialogComponent, DescripcionDialogComponent } from '../../features/admin/admin.component';

export interface DialogData {
  title: string;
  message: string;
  id: number;
  tipo: 'acta' | 'circular';
  titulo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogManagementService {
  private dialog = inject(MatDialog);

  /**
   * Abre un diálogo de formulario
   */
  openFormDialog(template: TemplateRef<any>, width: string = '400px'): MatDialogRef<any> {
    return this.dialog.open(template, { width });
  }

  /**
   * Abre un diálogo de confirmación para eliminación
   */
  openConfirmDialog(data: DialogData, width: string = '350px'): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: data.title,
        message: data.message,
        id: data.id,
        tipo: data.tipo,
        titulo: data.titulo
      },
      width
    });
  }

  /**
   * Abre un diálogo para mostrar descripción
   */
  openDescriptionDialog(data: any, width: string = '500px'): MatDialogRef<DescripcionDialogComponent> {
    return this.dialog.open(DescripcionDialogComponent, { 
      data, 
      width 
    });
  }

  /**
   * Cierra todos los diálogos abiertos
   */
  closeAllDialogs(): void {
    this.dialog.closeAll();
  }

  /**
   * Verifica si hay diálogos abiertos
   */
  hasOpenDialogs(): boolean {
    return this.dialog.openDialogs.length > 0;
  }
}