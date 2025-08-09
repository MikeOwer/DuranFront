import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DatarealtimeService } from '../../../layout/service/datarealtime.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, switchMap, takeUntil, map } from 'rxjs';
import { Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-lista',
  imports: [CommonModule, TableModule, ButtonModule, CardModule, FormsModule, DialogModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements OnInit, OnDestroy {
  data: any[] = [];
  cliente: any;
  creditoId: any;
  title: String = '';
  pagosPendientes: any[] = [];
  pagosRealizados: any[] = [];
  observaciones: any[] = [];
  model: any = 'clientes';
  private subs: Subscription[] = [];
  displayObservationDialog = false;
  newObservation = {
    text: '',
    date: new Date()
  };
  loading = true;
  constructor(private route: ActivatedRoute, private realtimeService: DatarealtimeService) { }

  ngOnInit(): void {

    this.loadData();

  }

  loadData(): void {
    const clienteId = this.route.snapshot.params['id'];

    // Primero obtenemos el cliente
    this.realtimeService.getRecord('clientes', clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;

        // Luego obtenemos ambos tipos de pagos en paralelo
        forkJoin([
          this.realtimeService.getRecordsWhere('pagos_realizado', 'idcliente', clienteId),
          this.realtimeService.getRecordsWhere('pagos_pendientes', 'idcliente', clienteId),
          this.realtimeService.getRecordsWhere('observaciones', 'idcliente', clienteId)
        ]).subscribe({
          next: ([realizados, pendientes, observaciones]) => {
            this.pagosRealizados = realizados;
            this.pagosPendientes = pendientes;
            this.observaciones = observaciones;
            console.log(this.pagosPendientes);
            console.log(this.pagosRealizados);
            console.log(observaciones);
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  openDialog() {
    this.newObservation = {
      text: '',
      date: new Date()
    };
    this.displayObservationDialog = true;
  }

  closeDialog() {
    this.displayObservationDialog = false;
  }

  saveObservation() {
    const clienteId = this.route.snapshot.params['id'];
    const data = {
      idcliente: clienteId,
      observacion: this.newObservation.text,
      fecha: this.newObservation.date.toISOString()
    };

    this.realtimeService.createRecord('observaciones', data).subscribe({
      next: (res) => {
        console.log('Observación creada:', res);
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error al crear observación:', err);
      }
    });
  }
}







