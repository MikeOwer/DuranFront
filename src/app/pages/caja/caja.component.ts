import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { DatarealtimeService } from '../../layout/service/datarealtime.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';
import { MessageService } from 'primeng/api';

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
    ButtonModule],
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


  constructor(
    private realtimeService: DatarealtimeService,
    private router: Router,
    private serviciogeneral: ServicioGeneralService,
    private messageService: MessageService
  ) { }
  ngOnInit() {

    /* this.serviciogeneral.get('credito', {}, true).subscribe(data => {
      this.data = data;
      console.log('Clientes:', data);
    }); */


    this.realtimeService.listenToCollectionExpand(this.model, 'idcliente,idinversionista').subscribe(data => {
      this.data = data.map(credito => ({
        ...credito,
        cliente: credito.expand?.idcliente || null,
        inversionista: credito.expand?.idinversionista || null
      }));

      console.log(this.data);
    });
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
}
