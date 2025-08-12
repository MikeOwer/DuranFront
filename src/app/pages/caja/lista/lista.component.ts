import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DatarealtimeService } from '../../../layout/service/datarealtime.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin, switchMap, takeUntil, map } from 'rxjs';
import { Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ServicioGeneralService } from '../../../layout/service/servicio-general/servicio-general.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumber } from "primeng/inputnumber";
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'app-lista',
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    FormsModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    InputNumber],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements OnInit {
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
  displayPagoDialog = false;
  newObservation = {
    text: '',
    date: new Date()
  };

  pagoForm!: FormGroup;
  formasPago = [{ label: 'Efectivo', value: 'EFECTIVO' },
  { label: 'Depósito Bancario', value: 'DEPOSITO' },
  { label: 'Nota de Crédito', value: 'NOTA' }
  ]
  tiposPago = [{ label: 'Letra Vencida', value: 'VENCIDA' },
  { label: 'Letra Anticipada', value: 'ANTICIPADA' },
  { label: 'Letra Adelantada', value: 'ADELANTADA' }
  ]

  loading = true;
  constructor(
    private route: ActivatedRoute,
    private routerBack: Router,
    private servicioGeneral: ServicioGeneralService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.loadData();
    this.initializeForm();
    this.pagoForm.get('recibido')?.valueChanges.subscribe(value => {
      const cambio = -1 * (this.pagosPendientes[0].monto - value) || 0;
      this.pagoForm.get('cambio')?.setValue(cambio > 0 ? cambio : 0, { emitEvent: false });
    });
  }

  initializeForm() {
    this.pagoForm = this.fb.group({
      importe: new FormControl('', Validators.required),
      recibido: new FormControl('', Validators.required),
      formaPago: new FormControl(null, Validators.required),
      tipoPago: new FormControl(null, Validators.required),
      cuentaDestino: new FormControl('', Validators.required),
      cambio: new FormControl(0),
    })
  }
  /** carga los datos de todas las tablas con base en credito
   */
  loadData(): void {
    this.creditoId = this.route.snapshot.params['id'];

    //Obtenemos el credito y los datos de las tablas relacionadas al credito
    this.servicioGeneral.get(`credito/${this.creditoId}`, {}, true).subscribe(credito => {
      forkJoin({
        payments_paid: this.servicioGeneral.get(`pago_realizado`, {}, true),
        payments_pending: this.servicioGeneral.get(`pago_pendiente`, {}, true),
        customer: this.servicioGeneral.get(`customers/${credito.data.customer_id}`),
        vehicles: this.servicioGeneral.get(`vehicles/${credito.data.vehicle_id}`),
        sucursales: this.servicioGeneral.get('sucursal'),
        observaciones: this.servicioGeneral.get('observacion', {}, true),
      }).subscribe(({ payments_paid, payments_pending, customer, vehicles, sucursales, observaciones }) => {
        const payment_paidList = payments_paid.data;
        const payment_pendingList = payments_pending.data;
        const sucursalesList = sucursales.data;
        const observacionList = observaciones.data;

        this.cliente = customer.data;
        this.vehicle = vehicles.data

        //filtrado de datos
        const payment_paid = payment_paidList
          .filter((c: any) => c.customer_id === credito.data.customer_id) // Deberia cambiarse para manejar por credito???
          .map((payment: any) => {
            const sucursal = sucursalesList.find((s: any) => s.id === payment.sucursal_id);
            return {
              ...payment,
              sucursal_name: sucursal.nombre,
            }
          });

        const payment_pending = payment_pendingList.filter((c: any) => c.credito_id === Number(this.creditoId));

        console.log("return de load after filter: credito:", credito)
        console.log("pagado: ", payment_paid);
        console.log("pendiente: ", payment_pending);
        console.log("cliente: ", customer)

        this.pagosPendientes = payment_pending || null;
        this.pagosRealizados = payment_paid || null;
        this.observaciones = credito.data.observacion || observacionList || null;
      })
    })
  }

  /** Returns to the previous page (Caja)
   * 
   */
  onBack() {
    this.routerBack.navigate([this.urlPage]);
  }

  openPago() {
    console.log(this.pagosPendientes[0]);
    this.pagoForm.patchValue({
      importe: this.pagosPendientes[0].monto,
    })
    this.displayPagoDialog = true;
  }

  /** Abre dialogo de observaciones
   * 
   */
  openDialog() {
    this.newObservation = {
      text: '',
      date: new Date()
    };
    this.displayObservationDialog = true;
  }

  /** Cierra dialogo de observaciones
   * 
   */
  closeDialog() {
    this.displayObservationDialog = false;
  }

  /** Guarda una nueva observacion
   * @todo: esperar a que se vea bien el flujo de las observaciones para poder modificar esto
   */
  saveObservation() {
    const clienteID = this.cliente.id;
    const data = {
      customer_id: clienteID,
      observacion: this.newObservation.text,
    };

    this.servicioGeneral.post(`observacion`, data).subscribe({
      next: (res) => {
        console.log('Observación creada: ', res)
      },
      error: (err) => {
        console.error('Error al crear la obsrvacion: ', err)
      }
    })

    /* this.realtimeService.createRecord('observaciones', data).subscribe({
      next: (res) => {
        console.log('Observación creada:', res);
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error al crear observación:', err);
      }
    }); */
  }
}







