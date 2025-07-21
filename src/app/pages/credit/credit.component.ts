import { Component, OnInit, ViewChild } from "@angular/core";
import { DatarealtimeService } from "../../layout/service/datarealtime.service";
import { Table, TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ActivatedRoute, Router } from "@angular/router";
import { ToolbarModule } from "primeng/toolbar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { Subscription, forkJoin } from "rxjs";
import { DialogModule } from 'primeng/dialog';
import { ServicioGeneralService } from "../../layout/service/servicio-general/servicio-general.service";

@Component({
  selector: "app-credit",
  templateUrl: "./credit.component.html",
  styleUrls: ["./credit.component.scss"],
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

export class CreditComponent implements OnInit {

  data: any[] = [];
  globalFilter: string = '';
  @ViewChild('dt') table!: Table;
  urlPage: string = './dashboard/credito/';
  titulo: string = 'Crédito';
  texto: string = 'crédito';
  model: any = 'Credito';
  private subs: Subscription[] = [];
  plazos: any[] = [];
  displayModal: boolean = false;
  selectedCredit: any = null;
  showPlazosDialog: boolean = false;
  showInfoDialog: boolean = false;
  plazosData: any[] = [];
  aval: any = {}
  cliente: any = {}
  constructor(
    private realtimeService: DatarealtimeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private servicioGeneral: ServicioGeneralService
  ) { }

  ngOnInit() {
    /*this.realtimeService.listenToCollectionExpand(this.model, 'idcliente').subscribe(data => {
       this.data = data.map(d => ({
      ...d,
      cliente: d.expand?.idcliente?.nombre || '',
      telefono: d.expand?.idcliente?.telefono || ''
    }));
    console.log(data);
    });
    this.subs.push(this.activatedRouter.params.subscribe(
      response => {
        console.log(response);
      }
    ))*/
    

    this.servicioGeneral.get('credito', {}, true).subscribe((creditos: any) => {
      forkJoin({
        customers: this.servicioGeneral.get('customers', {}, true),
        guarantees: this.servicioGeneral.get('customer_guarantee', {}, true)
      }).subscribe(({ customers, guarantees }) => {
        const customersList = customers.data;
        const guaranteeList = guarantees.data;

        this.data = creditos.data.map((credito: any) => {
          const cliente = customersList.find((c: any) => c.id === credito.customer_id);
          const aval = guaranteeList.find((c: any) => c.id === credito.customer_guarantee_id);
          return {
            ...credito,
            cliente: cliente || null,
            aval: aval || null
          };
        });

        console.log('datos completos de credito en onInit de credit component',this.data);
      });

    });


  }
//Cambios aqui -----------------------------------------------------------------------------------------------------------------------
  link(id: any = undefined,tipo: string = 'nuevo') {
    if (id) {
      console.log('Id en creditComponent',id);
      this.router.navigate([this.urlPage + tipo + id]);
    } else {
      console.log(this.urlPage + 'nuevo/')
      this.router.navigate([this.urlPage + tipo]);
    }
  }

  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }

  onFilterColumn(event: Event, field: string) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filter(inputValue, field, 'contains');
  }

  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains');
    console.log(inputValue);
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

  onClickPlazos(credito: any) {
    this.selectedCredit = credito;
    this.calculatePlazos(this.selectedCredit.plazo, this.selectedCredit.monto, this.selectedCredit.tasa_fmd, this.selectedCredit.fecha_inicial)
    this.showPlazosDialog = true;
  }

  calculatePlazos(plazos: number, monto: number, tasa: number, creado: Date) {
    const plazosArray = [];
    const tasaMensual = tasa / 100;
    const pagoCapital = monto / plazos;
    const pagoInteres = (tasaMensual) * monto;
    //const montoMensual = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazos));
    const montoMensual = pagoCapital + pagoInteres;

    for (let i = 1; i <= plazos; i++) {
      const date = this.sumarMeses(creado, i);
      plazosArray.push({
        plazo: i,
        monto: monto,
        tasa: tasa,
        pagoMensual: montoMensual,
        pagoCapital: pagoCapital,
        pagoInteres: pagoInteres,
        fechaDePago: date
      });
    }
    console.log(plazosArray);
    this.plazos = plazosArray;
    this.displayModal = true;
  }

  sumarMeses(fecha: Date, cantidad: number): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + cantidad);
    return nuevaFecha;
  }

  onClickInfo(credit: any) {
    this.selectedCredit = credit;
    console.log(this.selectedCredit);
    this.cliente = this.selectedCredit.cliente;
    this.aval = this.selectedCredit.aval;
    console.log(this.aval);
    this.showInfoDialog = true;
  }

}

