import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule, Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DatarealtimeService } from '../../layout/service/datarealtime.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';
@Component({
  selector: 'app-cartera',
  imports: [CommonModule, ToolbarModule, TableModule, InputGroupModule, InputGroupAddonModule,
    FormsModule, ConfirmDialogModule, ToastModule, ButtonModule, MultiSelectModule, DropdownModule],
  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.scss'
})

export class CarteraComponent implements OnInit {
  data: any[] = [];
  titulo: string = 'Cartera';
  @ViewChild('dt') table!: Table;
  globalFilter: string = '';
  columnas = [
    { field: 'nombre', header: 'Cliente' },
    { field: 'id', header: 'Código' },
    { field: 'monto', header: 'monto' },
    { field: 'creditoinicial', header: 'Crédito inicial' },
    { field: 'tipoCredito', header: 'Tipo de crédito' },
    { field: 'plazo', header: 'Plazo' },
    { field: 'fechaPago', header: 'Día de pago' },
    { field: 'capital', header: 'Capital' },
    { field: 'interes', header: 'Interés' },
    { field: 'iva', header: 'IVA' },
    { field: 'saldo', header: 'Saldo inicial' },
    { field: 'tm', header: 'TM' },
    { field: 'capital_cobrado', header: 'Capital cobrado' },
    { field: 'interes_cobrado', header: 'Interés cobrado' },
    { field: 'total_cobrado', header: 'Total cobrado' },
    { field: 'saldo_final', header: 'Saldo final' },
    { field: 'comprobacion', header: 'Comprobación' },
    { field: 'observaciones', header: 'Observaciones' }
  ];
  columnasVisibles = [...this.columnas];

  constructor(private realtimeService: DatarealtimeService, private router: Router, private servicio: ServicioGeneralService) { }
  model: any = 'clientes';
  inversionistasModel: any = 'catalogo_inversionistas';
  inversionistas: any[] = [];
  inversionistaSeleccionado: string = '';
  todosLosClientes: any[] = [];

  ngOnInit() {
    /*this.realtimeService.listenToCollectionExpand(this.model, 'idcreditos').subscribe((data) => {
      this.data = data.map(d => ({
      ...d,
      creditoInicial: d.expand?.idcreditos?.nombre || '',
    }));
    this.todosLosClientes = [...this.data];
    console.log(this.data);
    });*/
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
    /*this.realtimeService.listenToCollection(this.inversionistasModel).subscribe((data) => {
      this.inversionistas = data.map((inv: any) => ({
      id: inv.id,
      nombre: inv.nombre || 'Sin nombre'}));
       console.log(this.inversionistas);
    })*/

    this.servicio.get('investor_catalog', {}, true).subscribe({
      next: (data) => {
        console.log(data)
        this.inversionistas = data.data.map((inv: any) => ({
          id: inv.id,
          nombre: inv.name || 'Sin nombre'
        }));
        console.log(this.inversionistas);
      }
    });
  }

  filtrarClientesPorInversionista() {
    /*if (!this.inversionistaSeleccionado) {
      this.data = [...this.todosLosClientes];
      return;
    }

    this.data = this.todosLosClientes.filter(cliente =>
      cliente.id_inversionista === this.inversionistaSeleccionado
    );
    console.log(this.inversionistaSeleccionado);*/

    if(!this.inversionistaSeleccionado){
      this.limpiarInversionista();
      console.log(this.inversionistaSeleccionado)
      return;
    }

    this.servicio.get(`table_investor/${this.inversionistaSeleccionado}`, {}, false).subscribe({
      next: (data) => {
        console.log(data);
        this.data = data.data.original;
        console.log(this.data);
      }
    })

  }

  limpiarInversionista() {
    this.inversionistaSeleccionado = '';
    this.data = [];
  }

  onActivarPagos(){
    this.servicio.get('cron',{}, false).subscribe({
      next: (data) => {
        console.log(data);
        console.log('Pagos realizados con exito');
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
