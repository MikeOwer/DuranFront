import { Component, OnInit, ViewChild } from "@angular/core";
import { Table, TableModule } from "primeng/table";
import { DatarealtimeService } from "../../../../layout/service/datarealtime.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ServicioGeneralService } from "../../../../layout/service/servicio-general/servicio-general.service";
import { GeneralWebsocketService } from "../../../../layout/service/general-websocket.service";

@Component({
  selector: "app-lista-inversionistas",
  templateUrl: "./lista-inversionistas.component.html",
  styleUrls: ["./lista-inversionistas.component.scss"],
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

export class ListaInversionistasComponent implements OnInit {

  data: any[] = [];
  globalFilter: string = '';
  @ViewChild('dt') table!: Table;
  urlPage: string = './dashboard/catalogos/inversionistas/';
  titulo: string = 'Inversionistas';
  texto: string = 'inversionista';
  model: any = 'catalogo_inversionistas';

  constructor(
    private realtimeService: DatarealtimeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private service: ServicioGeneralService,
    private generalSocketService: GeneralWebsocketService
  ) { }

  ngOnInit() {
    /*this.realtimeService.listenToCollection(this.model).subscribe(data => {
      this.data = data;
    });*/

    this.service.get(`investor_catalog`, {}, true).subscribe({
       next: (data: any) => {
        console.log(data);
        this.data = data.data;
      }
    })

    this.generalSocketService.onEvent('investor-catalog', (event: any) => {
      console.log('Evento recibido desde servicio:', event);
      if (event.action === 'created') {
        console.log('Create');
        this.data = [...this.data, event.data];
      }else if (event.action === 'deleted') {
        console.log('Delete');
        const idEliminado = event.data.id;
        this.data = this.data.filter(item => item.id !== idEliminado);
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
     console.log(item);
    this.service.delete(`investor_catalog`, item).subscribe({
      next: (res: any) => {
        console.log(res);
      }
    });
  }
}
