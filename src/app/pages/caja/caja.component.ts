import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { DatarealtimeService } from '../../layout/service/datarealtime.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormControl, Validators, } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-caja',
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    InputGroupModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputTextModule],
  providers: [MessageService],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss'
})
export class CajaComponent {
  data: any[] = [];
  model: any = 'credito';
  titulo: string = 'Caja';
  texto: string = 'cliente';
  inversionista: any[] = [];
  cliente: any[] = [];
  selectedCredit: any = null;
  @ViewChild('dt') table!: Table;
  urlPage: string = './dashboard/caja';
  globalFilter: string = '';
  

  showWithdrawalDialog: boolean = false;
  withdrawalForm!: FormGroup;
  isConfirmed: boolean = false;


  constructor(
    private realtimeService: DatarealtimeService,
    private router: Router,
    private serviciogeneral: ServicioGeneralService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) { }
  ngOnInit() {

    /* this.serviciogeneral.get('credito', {}, true).subscribe(data => {
      this.data = data;
      console.log('Clientes:', data);
    }); */

    this.withdrawalForm = this.fb.group({
      amount: new FormControl('', Validators.required),
      concept: new FormControl('', Validators.required),
      fecha: [new Date()],
      inversionista_id: [this.inversionista]
    });


    this.realtimeService.listenToCollectionExpand(this.model, 'idcliente,idinversionista').subscribe(data => {
      this.data = data.map(credito => ({
        ...credito,
        cliente: credito.expand?.idcliente || null,
        inversionista: credito.expand?.idinversionista || null
      }));

      console.log(this.data);
    });

    this.getConfirmation();
  }


  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }

  link(id: any = undefined) {
    if (id) {
      console.log(this.urlPage + '/detalles/' + id);
      this.router.navigate([this.urlPage + '/detalles/' + id])
    }
  }

  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains');
  }

  reportarPago(id: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Reportar Pago',
      detail: `Se ha reportado el pago para el ID: ${id}`,
      life: 3000
    });
    console.log('Reportar pago para el ID:', id);
  }

  showRetiro() {
    this.showWithdrawalDialog = true;

  }

  getConfirmation() {
    try {
      const pusher = new Pusher('local', {
        wsHost: 'localhost',
        wsPort: 8080,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws'],
        cluster: 'mt1'
      });

      const channel = pusher.subscribe('confirmations');
      console.log('Canal: ', channel);

      channel.bind('confirmations', (data: any) => {
        console.log('Evento WebSocket:', data);

        this.isConfirmed = data.confirmation;
        console.log('Confirmación recibida:', this.isConfirmed);
      });
    } catch (error) {
      console.error(' Error al inicializar Pusher:', error);
    }
  }

  requestWithdrawal() {
    const message = {
      "investor_catalog_id": 1,
      "mensaje": "Mensajito"
    }
    this.serviciogeneral.post('enviar', message, false).subscribe({
      next: (data: any) => { }
    });

  }

  submitWithdrawal() {

    this.messageService.add({
      severity: 'success',
      summary: 'Información',
      detail: 'Retiro solicitado con éxito',
      life: 3000
    });
  }
}
