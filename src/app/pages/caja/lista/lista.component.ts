import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DatarealtimeService } from '../../../layout/service/datarealtime.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin, switchMap, takeUntil, map } from 'rxjs';
import { Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ServicioGeneralService } from '../../../layout/service/servicio-general/servicio-general.service';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, TableModule, ButtonModule, CardModule, FormsModule, DialogModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements OnInit, OnDestroy {
  data: any[] = [];
  cliente: any;
  vehicle: any;
  creditoId: any;
  urlPage: string = './dashboard/caja';
  title: String = 'Pagos';
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
  constructor(private route: ActivatedRoute,
    private routerBack: Router, private servicioGeneral: ServicioGeneralService, private realtimeService: DatarealtimeService) { }

  ngOnInit(): void {

    this.loadData();

  }

  loadData(): void {
    const creditoId = this.route.snapshot.params['id'];

    this.servicioGeneral.get(`credito/${creditoId}`, {}, true).subscribe(credito => {
      forkJoin({
        payments_paid: this.servicioGeneral.get(`pago_realizado`, {}, true),
        payments_pending: this.servicioGeneral.get(`pago_pendiente`, {}, true),
        customer: this.servicioGeneral.get(`customers/${credito.data.customer_id}`),
        vehicles: this.servicioGeneral.get(`vehicles/${credito.data.vehicle_id}`),
        sucursales: this.servicioGeneral.get('sucursal'),
      }).subscribe(({ payments_paid, payments_pending, customer, vehicles, sucursales }) => {
        const payment_paidList = payments_paid.data;
        const payment_pendingList = payments_pending.data;
        const sucursalesList = sucursales.data;

        this.cliente = customer.data;
        this.vehicle = vehicles.data

        const payment_paid = payment_paidList
          .filter((c: any) => c.customer_id === credito.data.customer_id)
          .map((payment: any) => {
            const sucursal = sucursalesList.find((s: any) => s.id === payment.sucursal_id);
            return {
              ...payment,
              sucursal_name: sucursal.nombre,
            }
          }); // Deberia cambiarse para manejar por credito???

        const payment_pending = payment_pendingList.filter((c: any) => c.credito_id === Number(creditoId));

        console.log("return de load after filter: credito:", credito)
        console.log("pagado: ", payment_paid);
        console.log("pendiente: ", payment_pending);
        console.log("cliente: ", customer)

        this.pagosPendientes = payment_pending || null;
        this.pagosRealizados = payment_paid || null;
        this.observaciones = credito.data.observacion || null;

        this.data = {
          ...credito,
          pago_realizado: payment_paid || null,
          pago_pendiente: payment_pending || null
        }
      })
    })
    /* // Primero obtenemos el cliente
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
    }); */
  }
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onBack() {
    this.routerBack.navigate([this.urlPage]);
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

  //TODO: esperar a que se vea bien el flujo de las observaciones para poder modificar esto
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







