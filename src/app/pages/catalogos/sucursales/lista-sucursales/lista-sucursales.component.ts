import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { Table, TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { DatarealtimeService } from "../../../../layout/service/datarealtime.service";
import { Router } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ServicioGeneralService } from "../../../../layout/service/servicio-general/servicio-general.service";
import Pusher from 'pusher-js';
import { GeneralWebsocketService } from "../../../../layout/service/general-websocket.service";

@Component({
  selector: "app-lista-sucursales",
  templateUrl: "./lista-sucursales.component.html",
  styleUrls: ["./lista-sucursales.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    MessageService, ConfirmationService
  ]
})

export class ListaSucursalesComponent implements OnInit {

  data: any[] = [];
  globalFilter: string = '';
  @ViewChild('dt') table!: Table;
  urlPage: string = './dashboard/catalogos/sucursales/';
  titulo: string = 'Sucursales';
  texto: string = 'sucursal';
  model: any = 'catalogo_sucursales';

  constructor(
    private realtimeService: DatarealtimeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private servicio: ServicioGeneralService,
    private generalSocketService: GeneralWebsocketService
  ) { }

  ngOnInit() {
    /*this.realtimeService.listenToCollection(this.model).subscribe(data => {
      this.data = data;
    });*/
    /* this.generalSocketService.initPusher('sucursal'); */

    this.servicio.get('sucursal', {}, true).subscribe(data => {
      this.data = data.data
    })

    this.generalSocketService.onEvent('sucursal', (event: any) => {
      console.log('Evento recibido desde servicio:', event);
      if (event.action === 'created') {
        this.data = [...this.data, event.data];
      }
    });
  }

  link(id: any = undefined) {
    if (id) {
      console.log(id);
      this.router.navigate([this.urlPage + 'editar/' + id]);
      console.log(this.router);
    } else {
      this.router.navigate([this.urlPage + 'nuevo/']);
    }
  }

  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }

  onFilterColumn(event: Event, field: string) {
    const inputValue = (event.target as HTMLInputElement).value;
    // "dt" es tu referencia a la tabla p-table (o DataTable)
    this.table.filter(inputValue, field, 'contains');
  }

  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    // "dt" es tu referencia a la tabla p-table (o DataTable)
    this.table.filterGlobal(inputValue, 'contains');
  }

  confirmDelete(item: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.realtimeService.deleteRecord(item.collectionName, item.id);
        this.messageService.add({
          severity: 'warn',
          summary: 'Eliminado',
          detail: 'Eliminado con exito'
        });
      }
    });
  }
}
