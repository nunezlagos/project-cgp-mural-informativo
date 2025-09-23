import { Component, OnInit, TemplateRef, ViewChild, inject, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AdminFacade } from '../../core/facades/admin.facade';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogManagementService } from '../../core/services/dialog-management.service';
import { FormManagementService } from '../../core/services/form-management.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
  ]
})
export class AdminComponent implements OnInit {
  @ViewChild('formTemplate') formTemplate!: TemplateRef<any>;
  formRef!: MatDialogRef<any>;
  tipo: 'acta' | 'circular' | null = null;
  form!: FormGroup;

  dataSourceActas = new MatTableDataSource<any>([]);
  dataSourceCirculares = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['autor','titulo','descripción', 'acciones'];

  // Dependency Inversion Principle - Inyección de dependencias especializadas
  private adminFacade = inject(AdminFacade);
  private dialogService = inject(DialogManagementService);
  private formService = inject(FormManagementService);
  
  editandoId: number | null = null;
  tab: any;

  ngOnInit() {
    this.loadActas();
    this.loadCirculares();
  }

  trackById = (_: number, item: any) => item.id;

  loadActas() {
    this.adminFacade.loadActas()
      .then(data => {
        this.dataSourceActas.data = data;
      })
      .catch(err => {
        console.error('Error cargando actas:', err);
      });
  }

  loadCirculares() {
    this.adminFacade.loadCirculares()
      .then(data => {
        this.dataSourceCirculares.data = data;
      })
      .catch(err => {
        console.error('Error cargando circulares:', err);
      });
  }

  // Single Responsibility Principle - Delegación al servicio de formularios
  openForm(tipo: 'acta' | 'circular') {
    this.tipo = tipo;
    this.form = this.formService.createEmptyForm();
    this.formRef = this.dialogService.openFormDialog(this.formTemplate, '400px');
  }

  // Single Responsibility Principle - Uso del servicio de formularios para validación
  submit() {
    if (!this.tipo) return;

    // Validación usando el servicio especializado
    const validation = this.formService.validateForm(this.form);
    if (!validation.isValid) {
      this.formService.markAllFieldsAsTouched(this.form);
      console.error('Errores de validación:', validation.errors);
      return;
    }

    const data = this.formService.extractFormData(this.form);

    const action = this.editandoId
      ? (this.tipo === 'acta'
          ? this.adminFacade.saveActa({ ...data, id: this.editandoId })
          : this.adminFacade.saveCircular({ ...data, id: this.editandoId }))
      : (this.tipo === 'acta'
          ? this.adminFacade.validateAndSaveActa(data)
          : this.adminFacade.validateAndSaveCircular(data));

    action
      .then(() => {
        this.tipo === 'acta' ? this.loadActas() : this.loadCirculares();
        this.formRef.close();
        this.editandoId = null;
      })
      .catch(err => {
        console.error(`Error ${this.editandoId ? 'editando' : 'creando'} ${this.tipo}:`, err);
        // Mostrar mensaje de error al usuario si es necesario
      });
  }

  // Single Responsibility Principle - Delegación al servicio de formularios
  editar(item: any, tipo: 'acta' | 'circular') {
    this.tipo = tipo;
    this.editandoId = item.id;

    // Uso del servicio especializado para crear formulario de edición
    this.form = this.formService.createEditForm(item);
    this.formRef = this.dialogService.openFormDialog(this.formTemplate, '400px');
  }

  // Single Responsibility Principle - Delegación al servicio de diálogos
  confirmDelete(id: number, tipo: 'acta' | 'circular', titulo: string) {
    const dialogRef = this.dialogService.openConfirmDialog({
      title: 'Confirmar Eliminación',
      message: `¿Seguro que quieres borrar este elemento?`,
      id: id,
      tipo: tipo,
      titulo: titulo
    }, '350px');

    dialogRef.afterClosed().subscribe(async result => {
      console.log('Resultado del diálogo:', result);

      if (result?.delete === true) {
        try {
          const action = result.tipo === 'acta'
            ? this.adminFacade.deleteActa(result.id)
            : this.adminFacade.deleteCircular(result.id);

          await action;

          if (result.tipo === 'acta') {
            this.loadActas();
          } else if (result.tipo === 'circular') {
            this.loadCirculares();
          }
        } catch (err) {
          console.error(`Error eliminando ${result.tipo}:`, err);
        }
      }
    });
  }




  // Single Responsibility Principle - Delegación al servicio de diálogos
  mostrarDescripcion(item: any) {
    this.dialogService.openDescriptionDialog(item, '500px');
  }
}
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title class="text-center text-primary">{{ data.title }}</h2>
    <mat-dialog-content class="text-center mb-4">
      {{ data.message }}
      <br><br>
      <strong>ID:</strong> {{ data.id }} <br>
      <strong>Título:</strong> {{ data.titulo }}
    </mat-dialog-content>
    <mat-dialog-actions class="d-flex justify-content-between">
      <button mat-button mat-dialog-close="false" class="btn-core btn-add btn-sm">
        Cancelar
      </button>
      <button mat-button
  class="btn-core btn-delete btn-sm"
  (click)="onDelete(data.id, data.tipo, data.titulo)">
  Eliminar
</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule]
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>  // Inyectar el MatDialogRef
  ) {}

  onDelete(id: number, tipo: 'acta' | 'circular', titulo: string) {
    console.log('Datos de eliminación:', { delete: true, id, tipo, titulo });
    this.dialogRef.close({ delete: true, id, tipo, titulo });
  }

}

@Component({
  selector: 'app-descripcion-dialog',
  standalone: true,
  template: `
    <h3 mat-dialog-title class="text-center text-primary">{{ data.titulo }}</h3>

    <mat-dialog-content class="py-4">
      <div [innerHTML]="data.cuerpo" class="mt-3"></div>
    </mat-dialog-content>

    <mat-dialog-actions class="d-flex justify-content-end">
      <button mat-button mat-dialog-close class="btn btn-outline-secondary btn-sm">
        Cerrar
      </button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule]
})
export class DescripcionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

