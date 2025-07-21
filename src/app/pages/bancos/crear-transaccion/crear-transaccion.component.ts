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
  selector: 'app-crear-transaccion',
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
    DropdownModule
  ],
  templateUrl: './crear-transaccion.component.html',
  styleUrl: './crear-transaccion.component.scss'
})
export class CrearTransaccionComponent {

  titulo: string = 'Transaccion';
  texto: string = 'transaccion';
  model: any = 'bank_transaction';
  transaccionChannelName: string = 'bank_transaction';
  inputGroupValue: any;
  idData?: number = undefined;
  form!: FormGroup;
  data: any = {};
  tipo: any[] = [
    { name: "Deposito", value: 'deposito' },
    { name: "Retiro", value: 'retiro' }
  ];
  agregarSemana: any = {};
  private subs: Subscription[] = [];
  urlPage: string = './dashboard/bancos';
  visible: boolean = false;
  bancos: any[] = [];
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

    this.form = this.fb.group({
      descripcion: new FormControl(''),
      cantidad: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)
      ]),
      tipo: new FormControl('', Validators.required),
      vehiculoSeleccionado: ['', Validators.required]
    });

    this.servicioGeneral.get('bank',{}, false).subscribe({
      next: (data) => {
        this.bancos = data.data;
        console.log(this.bancos);
      }
    })

  }

  onBack() {
    this.routerBack.navigate([this.urlPage]);
  }

  submitData() {
    this.data = {
      description: this.form.value.descripcion,
      amount: this.form.value.cantidad,
      transaction_type: this.form.value.tipo,
      bank_id: this.form.value.bancoSeleccionado
    }

    console.log('Transaccion:',this.data);

    this.servicioGeneral.post(this.model, this.data).subscribe({
      next: (data: any) => {
      },
      error: (err: any) => {
        console.error('Error al cargar', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear'
        });
      }
    })

    this.routerBack.navigate(['./auth/login'])
  }
  
}
