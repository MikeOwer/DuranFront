import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextModule } from "primeng/inputtext";
import { Table, TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { DatarealtimeService } from "../../../../layout/service/datarealtime.service";
import { Router } from "@angular/router";
import { ServicioGeneralService } from "../../../../layout/service/servicio-general/servicio-general.service";
import Pusher from "pusher-js";
import { GeneralWebsocketService } from "../../../../layout/service/general-websocket.service";

@Component({
  selector: "app-lista-vehiculos",
  templateUrl: "./lista-vehiculos.component.html",
  styleUrls: ["./lista-vehiculos.component.scss"],
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

export class ListaVehiculosComponent implements OnInit {

  data: any[] = [];
  globalFilter: string = '';
  @ViewChild('dt') table!: Table;
  urlPage: string = './dashboard/catalogos/vehiculos/';
  titulo: string = 'Vehiculos';
  texto: string = 'vehiculo';
  model: any = 'vehiculos';

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

    this.servicio.get('vehicles', {}, true).subscribe(data => {
      console.log(data);
      this.data = data.data;
    })

    this.generalSocketService.onEvent('vehicle', (event: any) => {
      console.log('Evento recibido desde servicio:', event);
      if (event.action === 'created') {
        this.data = [...this.data, event.data];
      } else if(event.action === 'updated') {
        this.data = this.data.map(item =>
          item.id === event.data.id ? event.data : item
        );
      } else {
        this.data = this.data.filter(item => item.id !== event.data.id);
      }
    });
  }

  link(id: any = undefined) {
    if (id) {
      console.log(id);
      this.router.navigate([this.urlPage + 'editar/' + id]);
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
    this.servicio.delete('vehicles', item,false).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Eliminado',
          detail: 'Eliminado con exito'
        });
      }
      
    });
        
    }
  }

