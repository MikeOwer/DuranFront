import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule, Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, InputGroupModule, FormsModule, ToolbarModule, TableModule, ConfirmDialogModule, ToastModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit{
  data: any []= [];
  titulo: string = 'Movimientos autos duran';
  @ViewChild('dt') table!: Table;
  globalFilter: string = '';

  constructor(private servicio: ServicioGeneralService){}

  ngOnInit() {
    this.cargarDatos();
  }

  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }


  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    // "dt" es tu referencia a la tabla p-table (o DataTable)
    this.table.filterGlobal(inputValue, 'contains');
  }

  cargarDatos(){
    this.servicio.get('historial_actividades', {}, true).subscribe(data => {
      console.log(data);
      this.data = data.data;
    })
  }
}
