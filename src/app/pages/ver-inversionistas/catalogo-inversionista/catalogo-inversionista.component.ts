import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DatarealtimeService } from '../../../layout/service/datarealtime.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { ServicioGeneralService } from '../../../layout/service/servicio-general/servicio-general.service';
@Component({
  selector: 'app-catalogo-inversionista',
  imports: [CommonModule, ToolbarModule, FormsModule, TableModule, ConfirmDialogModule, ToastModule, ButtonModule],
  templateUrl: './catalogo-inversionista.component.html',
  styleUrl: './catalogo-inversionista.component.scss'
})
export class CatalogoInversionistaComponent implements OnInit {
  titulo: string = '';
  @ViewChild('dt') table!: Table;
  globalFilter: string = '';
  data: any[] = [];
  clientesRelacionados: any[] = [];
  inversionistaId: any = '';
  constructor(private realtimeService: DatarealtimeService, private router: Router, private route: ActivatedRoute, private location: Location, private servicioGeneral: ServicioGeneralService) { }
  ngOnInit(): void {
    this.inversionistaId = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      inversionistas: this.servicioGeneral.get(`investor_catalog`, {}, true),
      creditos: this.servicioGeneral.get(`credito`, {}, true),
      vehiculos: this.servicioGeneral.get('vehicles', {}, true)
    }).subscribe({
      next: ({ inversionistas, creditos, vehiculos }) => {
        const filtrados = inversionistas.data.filter((item: any) => item.id === this.inversionistaId);

        if (filtrados.length > 0) {
          const inversionista = filtrados[0];
          const creditosRelacionados = creditos.data.filter((c: any) => c.customer_id === this.inversionistaId);

          const vehiclesRelacionados = creditosRelacionados
            .map((credito: any) => {
              const vehiculo = vehiculos.data.find((v: any) => v.id === credito.vehicle_id);
              return {
                ...credito,
                vehiculo: vehiculo || null
              };
            });

          this.data = [{
            ...inversionista,
            creditos: vehiclesRelacionados
          }];

          console.log(this.data[0].creditos[0]);
        } else {
          console.warn('No se encontró el inversionista.');
        }
      },
      error: (err) => {
        console.error('Error en la carga de datos', err);
      }
    });
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
  goBack() {
    this.location.back();
  }



}
