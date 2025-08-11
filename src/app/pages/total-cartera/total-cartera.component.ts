import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule, Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DatarealtimeService } from '../../layout/service/datarealtime.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';

@Component({
  selector: 'app-total-cartera',
  imports: [
    CommonModule, ToolbarModule, TableModule, InputGroupModule, InputGroupAddonModule,
    FormsModule, ConfirmDialogModule, ToastModule, ButtonModule, MultiSelectModule, DropdownModule
  ],
  templateUrl: './total-cartera.component.html',
  styleUrl: './total-cartera.component.scss'
})
export class TotalCarteraComponent {
  data: any[] = [];
  titulo: string = 'Cartera';

  @ViewChild('dt') table!: Table;
  globalFilter: string = '';

  columnas = [
    { field: 'cliente', header: 'Cliente' },
    { field: 'codigo', header: 'Código' },
    { field: 'monto', header: 'Monto' },
    { field: 'credito_inicial', header: 'Crédito inicial' },
    { field: 'tipo_credito', header: 'Tipo de crédito' },
    { field: 'plazo', header: 'Plazo' },
    { field: 'dia_pago', header: 'Día de pago' },
    { field: 'capital', header: 'Capital' },
    { field: 'interes', header: 'Interés' },
    { field: 'iva', header: 'IVA' },
    { field: 'saldo_inicial', header: 'Saldo inicial' },
    { field: 'tm', header: 'TM' },
    { field: 'capital_cobrado', header: 'Capital cobrado' },
    { field: 'interes_cobrado', header: 'Interés cobrado' },
    { field: 'total_cobrado', header: 'Total cobrado' },
    { field: 'saldo_final', header: 'Saldo final' },
    { field: 'comprobacion', header: 'Comprobación' },
    { field: 'observaciones', header: 'Observaciones' }
  ];

  columnasVisibles = [...this.columnas];

  constructor(
    private realtimeService: DatarealtimeService,
    private router: Router,
    private servicio: ServicioGeneralService
  ) { }

  model: any = 'clientes';
  inversionistasModel: any = 'catalogo_inversionistas';
  inversionistas: any[] = [];
  inversionistaSeleccionado: string = '';
  todosLosClientes: any[] = [];
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  ngOnInit() {

  }

  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }

  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains');
  }

  mostrarColumna(campo: string): boolean {
    return this.columnasVisibles.some(col => col.field === campo);
  }




}
