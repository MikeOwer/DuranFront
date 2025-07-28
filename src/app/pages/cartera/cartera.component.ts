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
  selector: 'app-cartera',
  imports: [
    CommonModule, ToolbarModule, TableModule, InputGroupModule, InputGroupAddonModule,
    FormsModule, ConfirmDialogModule, ToastModule, ButtonModule, MultiSelectModule, DropdownModule
  ],
  templateUrl: './cartera.component.html',
  styleUrls: ['./cartera.component.scss']
})
export class CarteraComponent implements OnInit {
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
    this.cargarInversionistas();
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

  cargarInversionistas() {
    this.servicio.get('investor_catalog', {}, true).subscribe({
      next: (data) => {
        this.inversionistas = data.data.map((inv: any) => ({
          id: inv.id,
          nombre: inv.name || 'Sin nombre'
        }));
      }
    });
  }

  filtrarClientesPorInversionista() {
    if (!this.inversionistaSeleccionado) {
      this.limpiarInversionista();
      return;
    }

    this.servicio.get(`table_investor/${this.inversionistaSeleccionado}`, {}, false).subscribe({
      next: (data) => {
        // Aquí mapea los datos para asegurarte que tienen las propiedades correctas
        this.data = data.data.original.map((item: any) => ({
          cliente: item.cliente,
          codigo: item.codigo,
          monto: item.monto,
          credito_inicial: item.credito_inicial,
          tipo_credito: item.tipo_credito,
          plazo: item.plazo,
          dia_pago: item.dia_pago,
          capital: item.capital,
          interes: item.interes,
          iva: item.iva,
          saldo_inicial: item.saldo_inicial,
          tm: item.tm,
          capital_cobrado: item.capital_cobrado,
          interes_cobrado: item.interes_cobrado,
          total_cobrado: item.total_cobrado,
          saldo_final: item.saldo_final,
          comprobacion: item.comprobacion,
          observaciones: item.observaciones
        }));
      }
    });
  }

  limpiarInversionista() {
    this.inversionistaSeleccionado = '';
    this.data = [];
  }

  onActivarPagos() {
    this.servicio.get('cron', {}, false).subscribe({
      next: (data) => {
        console.log('Pagos realizados con éxito');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  aplicarFiltroFecha() {
    if (!this.fechaDesde || !this.fechaHasta) {
      return;
    }

    const fromDate = new Date(this.fechaDesde);
    const toDate = new Date(this.fechaHasta);

    const from = fromDate.toISOString().split('T')[0];
    const to = toDate.toISOString().split('T')[0];

    const params = { from, to };

    this.servicio.get('portfolios', params, false).subscribe({
      next: (data) => {
        this.data = data.data;
      },
      error: (error) => {
        console.error('Error al obtener datos por fecha', error);
      }
    });
  }


}
