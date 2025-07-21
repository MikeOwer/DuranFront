import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatarealtimeService } from "../../../../layout/service/datarealtime.service";
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
import { ServicioGeneralService } from "../../../../layout/service/servicio-general/servicio-general.service";
import { GeneralWebsocketService } from "../../../../layout/service/general-websocket.service";

@Component({
  selector: "app-inversionista",
  templateUrl: "./inversionista.component.html",
  styleUrls: ["./inversionista.component.scss"],
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
  ],
  providers: [
    MessageService
  ]
})

export class InversionistaComponent implements OnInit {

  titulo: string = 'Inversionista';
  texto: string = 'inversionista';
  model: any = 'investor_catalog';
  inversionistaChannelName: string = 'investor-catalog';
  inputGroupValue: any;
  idData?: number = undefined;
  form!: FormGroup;
  data: any = {};
  estatus: any[] = [
    { name: "Activo", value: 0 },
    { name: "Suspendido", value: 1 }
  ];
  agregarSemana: any = {};
  private subs: Subscription[] = [];
  urlPage: string = './dashboard/catalogos/inversionistas/lista';
  visible: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private routerBack: Router,
    private fb: FormBuilder,
    private servicio: DatarealtimeService,
    private messageService: MessageService,
    private servicioGeneral: ServicioGeneralService,
    private generalSocketService: GeneralWebsocketService
  ) {

  }

  ngOnInit() {

    this.form = this.fb.group({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
      celular: new FormControl(''),
      telefono: new FormControl(''),
    });


    this.subs.push(this.router.params.subscribe(
      response => {
        if (response['id']) {
          console.log(response['id']);
          this.idData = response['id'];
          this.cargarDatos();
        } else {
          this.data.disabled = true;
        }
      },
      error => {

      }
    ));

  }

  onBack() {
    this.routerBack.navigate([this.urlPage]);
  }


  async cargarDatos() {
    /*this.subs.push(
      this.servicio.getRecord(this.model, this.idData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.data = data;
        },
        error: (err: any) => {
          console.error('Error al cargar', err);
        }
      })
    );*/

    this.servicioGeneral.get(`investor_catalog`, {}, true).subscribe({
      next: (data: any) => {
        console.log(data);
        this.idData = Number(this.idData);
        const filtrados = data.data.filter((item: any) => {
          const coincide = item.id === this.idData;
          return coincide;
        });
        console.log(filtrados);
        this.data = filtrados[0];
        console.log(this.data);
      }
    })
  }

  submitData() {
    this.data = {
      name: this.form.value.nombre,
      last_name: this.form.value.apellido,
      email: this.form.value.email,
      phone_number: this.form.value.telefono,
      cellphone_number: this.form.value.celular,
      balance: this.form.value.saldo,
    }

    if (this.idData) {
      this.servicioGeneral.update(this.model, this.idData, this.data, false).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Los información fue actualizado correctamente'
          });
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
    } else {
      this.servicioGeneral.post(this.model, this.data).subscribe({
        next: (data: any) => {
          /* this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'La información fue guardado correctamente'
          }); */
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
    }

    this.routerBack.navigate(['./dashboard/catalogos/inversionistas/lista']);
  }
}
