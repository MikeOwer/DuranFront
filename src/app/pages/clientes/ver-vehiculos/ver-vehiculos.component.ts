import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FluidModule } from "primeng/fluid";
import { InputTextModule } from "primeng/inputtext";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputGroupModule } from "primeng/inputgroup";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { SelectModule } from "primeng/select";
import { TabsModule } from "primeng/tabs";
import { TableModule } from "primeng/table";
import { ServicioGeneralService } from "../../../layout/service/servicio-general/servicio-general.service";
import { GeneralWebsocketService } from "../../../layout/service/general-websocket.service";
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-ver-vehiculos',
  imports: [
    CommonModule,
    FluidModule,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputNumberModule,
    ButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    TabsModule,
    TableModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './ver-vehiculos.component.html',
  styleUrl: './ver-vehiculos.component.scss'
})
export class VerVehiculosComponent {

  titulo: string = 'Transaccion';
  texto: string = 'transaccion';
  model: any = 'bank_transaction';
  transaccionChannelName: string = 'bank_transaction';
  inputGroupValue: any;
  idCliente?: number = undefined;
  form!: FormGroup;
  data: any = {};
  tipo: any[] = [
    { name: "Deposito", value: 'deposito' },
    { name: "Retiro", value: 'retiro' }
  ];
  agregarSemana: any = {};
  private subs: Subscription[] = [];
  urlPage: string = './dashboard/clientes/lista';
  visible: boolean = false;
  vehiculos: any[] = [];
  bancoSeleccionadoId: any = null;

  constructor(
    private router: ActivatedRoute,
    private routerBack: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private servicioGeneral: ServicioGeneralService,
    private generalSocketService: GeneralWebsocketService
  ) {}

  mostrarCambio(){
    console.log(this.form.value)

  }

  ngOnInit() {

    this.generalSocketService.onEvent('vehicle', (event: any) => {
      console.log('Evento recibido desde servicio:', event);
      if (event.action === 'created') {
        this.data = [...this.data, event.data];
      }
    });

    this.router.params.subscribe(params => {
      this.idCliente = params['id'];
      console.log('ID del cliente recibido:', this.idCliente);
      this.verVehiculos(this.idCliente);
    });
  }

  verVehiculos(event: any){
    const vehiculoId = event.data; 
    this.servicioGeneral.get('customer/vehicles/'+event,{}, false).subscribe({
      next: (data) => {
        console.log('data:',data);
        this.vehiculos = data.data;
        console.log(this.vehiculos);
      }
    })
  }

  onBack() {
    this.routerBack.navigate([this.urlPage]);
  }

}
