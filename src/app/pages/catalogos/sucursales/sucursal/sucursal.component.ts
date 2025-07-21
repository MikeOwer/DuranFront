import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DatarealtimeService } from "../../../../layout/service/datarealtime.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { InputNumberModule } from "primeng/inputnumber";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ServicioGeneralService } from "../../../../layout/service/servicio-general/servicio-general.service";
import { GeneralWebsocketService } from "../../../../layout/service/general-websocket.service";

@Component({
  selector: "app-sucursal",
  templateUrl: "./sucursal.component.html",
  styleUrls: ["./sucursal.component.scss"],
  imports: [
    CommonModule,
    InputTextModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})

export class SucursalComponent implements OnInit {

  titulo: string = 'Sucursales';
  texto: string = 'sucursal';
  model: any = 'sucursal';
  idData?: number = undefined;
  form!: FormGroup;
  data: any = {};
  sucursalData: any = {};
  estatus: any[] = [
    { name: "Activo", value: true },
    { name: "Suspendido", value: false }
  ];
  private subs: Subscription[] = [];
  urlPage: string = './dashboard/catalogos/sucursales/lista';


  constructor(
    private router: ActivatedRoute,
    private routerBack: Router,
    private fb: FormBuilder,
    private servicio: DatarealtimeService,
    private messageService: MessageService,
    private servicioGeneral: ServicioGeneralService,
    private generalSocketService: GeneralWebsocketService,
  ) {

  }

  ngOnInit() {
    /* this.generalSocketService.initPusher(this.model);
 */
    this.form = this.fb.group({
      disabled: new FormControl(''),
      nombre: new FormControl('', Validators.required),
    });
    this.subs.push(this.router.params.subscribe(
      response => {
        if (response['id']) {
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

    this.servicioGeneral.get('sucursal', {}, true).subscribe({
      next: (data: any) => {
        console.log(data);
        this.idData = Number(this.idData);
        const filtrados = data.data.filter((item: any) => {
          const coincide = item.id === this.idData;
          return coincide;
        });
        this.data = filtrados[0];
        console.log(this.data);
      }
    })

  }

  submitData() {
    this.sucursalData = { nombre: this.form.value.nombre };

    if (this.idData) {
      this.servicioGeneral.update(this.model, this.idData, this.data).subscribe({
        next: (data: any) => {
          /* this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'El usuario fue actualizado correctamente'
          }); */
        },
        error: (err: any) => {
          console.error('Error al cargar', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el usuario'
          });
        }
      })
    } else {
      this.servicioGeneral.post(this.model, this.sucursalData).subscribe({
        next: (data: any) => {
          console.log(data);

          /* this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'La sucursal fue guardada correctamente'
          }); */
        },
        error: (err: any) => {
          console.error('Error al cargar', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el usuario'
          });
        }
      })
    }

    this.routerBack.navigate(['./dashboard/catalogos/sucursales/lista']);
  }
}
