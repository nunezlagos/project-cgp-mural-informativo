import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularesService } from '../../core/services/circulares.service';
@Component({
  selector: 'app-mural',
  standalone: true,
  templateUrl: './mural.component.html',
  styleUrl: './mural.component.css',
  imports: [CommonModule]
})
export class MuralComponent implements OnInit {
  circulares: any[] = [];
  expandido: { [id: number]: boolean } = {};

  private circularesService = inject(CircularesService);

  ngOnInit() {
    this.circularesService.getAll()
      .then(data => this.circulares = data)
      .catch(err => console.error('Error cargando circulares:', err));
  }

  limitarTexto(texto: string, limite: number): string {
    const palabras = texto.split(' ');
    return palabras.length > limite ? palabras.slice(0, limite).join(' ') + '...' : texto;
  }

  toggleExpand(id: number) {
    this.expandido[id] = !this.expandido[id];
  }
}
