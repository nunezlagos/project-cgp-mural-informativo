import { Component, OnInit, TemplateRef, ViewChild, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActasService } from '../../core/services/actas.service';
import { CircularesService } from '../../core/services/circulares.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin',
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

  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private actasService = inject(ActasService);
  private circularesService = inject(CircularesService);
  editandoId: number | null = null;
  tab: any;

  ngOnInit() {
    this.loadActas();
    this.loadCirculares();
  }

  trackById = (_: number, item: any) => item.id;

  loadActas() {
    this.actasService.getAll()
      .then(data => {
        this.dataSourceActas.data = data;
      })
      .catch(err => {
        console.error('Error cargando actas:', err);
      });
  }

  loadCirculares() {
    this.circularesService.getAll()
      .then(data => {
        this.dataSourceCirculares.data = data;
      })
      .catch(err => {
        console.error('Error cargando circulares:', err);
      });
  }

  openForm(tipo: 'acta' | 'circular') {
    this.tipo = tipo;
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      cuerpo: ['', Validators.required],
    });
    this.formRef = this.dialog.open(this.formTemplate, { width: '400px' });
  }

  submit() {
    if (this.form.invalid || !this.tipo) return;

    const data = this.form.value;

    const action = this.editandoId
      ? (this.tipo === 'acta'
          ? this.actasService.update(this.editandoId, data)
          : this.circularesService.update(this.editandoId, data))
      : (this.tipo === 'acta'
          ? this.actasService.create(data)
          : this.circularesService.create(data));

    action
      .then(() => {
        this.tipo === 'acta' ? this.loadActas() : this.loadCirculares();
        this.formRef.close();
        this.editandoId = null;
      })
      .catch(err => {
        console.error(`Error ${this.editandoId ? 'editando' : 'creando'} ${this.tipo}:`, err);
      });
  }

  editar(item: any, tipo: 'acta' | 'circular') {
    this.tipo = tipo;
    this.editandoId = item.id;

    this.form = this.fb.group({
      titulo: [item.titulo, Validators.required],
      autor: [item.autor, Validators.required],
      cuerpo: [item.cuerpo, Validators.required],
    });

    this.formRef = this.dialog.open(this.formTemplate, { width: '400px' });
  }

  confirmDelete(id: number, tipo: 'acta' | 'circular', titulo: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Seguro que quieres borrar este elemento?`,
        id: id,
        tipo: tipo,  // Asegúrate de pasar el tipo correctamente aquí
        titulo: titulo
      },
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('Resultado del diálogo:', result);

      if (result?.delete === true) {
        try {
          const action = result.tipo === 'acta'
            ? this.actasService.delete(result.id)
            : this.circularesService.delete(result.id);

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




  mostrarDescripcion(item: any) {
    this.dialog.open(DescripcionDialogComponent, { data: item, width: '500px' });
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

