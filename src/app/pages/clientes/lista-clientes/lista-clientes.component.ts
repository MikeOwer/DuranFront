import { Component, OnInit, ViewChild } from "@angular/core";
import { DatarealtimeService } from "../../../layout/service/datarealtime.service";
import { Table, TableModule } from "primeng/table";
import { CommonModule, JsonPipe } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { Router } from "@angular/router";
import { ToolbarModule } from "primeng/toolbar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { ServicioGeneralService } from "../../../layout/service/servicio-general/servicio-general.service";
import Pusher from 'pusher-js';
import { GeneralWebsocketService } from "../../../layout/service/general-websocket.service";

@Component({
  selector: "app-lista-clientes",
  templateUrl: "./lista-clientes.component.html",
  styleUrls: ["./lista-clientes.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule, 
    DialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})

export class ListaClientesComponent implements OnInit {

  data: any[] = [];
  globalFilter: string = '';
  @ViewChild('dt') table!: Table;
  urlPage: string = './dashboard/clientes/';
  titulo: string = 'Clientes';
  texto: string = 'cliente';
  model: any = 'clientes';
  selectedProduct: any;
  displayDialog: boolean = false;
  collectionName = 'clientes';

  constructor(
    private realtimeService: DatarealtimeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private serviciogeneral: ServicioGeneralService,
    private generalSocketService: GeneralWebsocketService
  ) { }

  ngOnInit() {
    /*this.realtimeService.listenToCollection(this.model).subscribe(data => {
      this.data = data;
      console.log(this.data);
    });*/
    //this.cargarDatos2();

    this.serviciogeneral.get('customers', {}, true).subscribe(data =>{
      this.data = data.data;
      console.log(this.data);
    })

    this.generalSocketService.onEvent('customer', (event: any) => {
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
    /* this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.serviciogeneral.delete(this.model, item);
        this.messageService.add({
          severity: 'warn',
          summary: 'Eliminado',
          detail: 'Eliminado con exito'
        });
      }
    }); */

    this.serviciogeneral.delete('customers', item).subscribe({
      next: (data)=>{
        this.messageService.add({
          severity: 'warn',
          summary: 'Eliminado',
          detail: 'Eliminado con exito'
        });
      }
    });
        
  }

  onRowSelect(event: any){
    this.selectedProduct = event.data;
    this.displayDialog = true;
    console.log('Selected Product:', this.selectedProduct);
  }
  
  onDialogHide() {
    this.selectedProduct = null;
  }

  pocketbaseBaseUrl = 'http://127.0.0.1:43529/api/files/clientes/';

  getImageUrl(record: any): string {
    console.log('selectedProduct.ine:', record);
    console.log(this.pocketbaseBaseUrl + this.selectedProduct.id + "/" + record);
    console.log('selectedProduct.id:', this.selectedProduct.id);
    console.log('selectedProduct.ine:', this.selectedProduct.ine);
    console.log('selectedProduct completo:', this.selectedProduct);
    return this.pocketbaseBaseUrl + this.selectedProduct.id + "/" + record;

  }

   cargarDatos2(){
    this.serviciogeneral.get('customers', {}, true).subscribe({
      next: (data)=>{
        this.data = data.data;
        console.log(this.data);
      }
    })
  }

  verVehiculos(id: any){
    this.router.navigate([this.urlPage + 'vehiculo/' + id])
  }

  verPagos(id: any){
    this.router.navigate([this.urlPage + 'pagos/' + id]);
  }

  verObservaciones(id: any){
    this.router.navigate([this.urlPage + 'observaciones/' + id]);
  }

}
