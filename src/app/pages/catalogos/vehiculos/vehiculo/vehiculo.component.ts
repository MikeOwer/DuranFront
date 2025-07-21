import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DatarealtimeService } from "../../../../layout/service/datarealtime.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputGroupModule } from "primeng/inputgroup";
import { InputNumberModule } from "primeng/inputnumber";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ServicioGeneralService } from "../../../../layout/service/servicio-general/servicio-general.service";

@Component({
  selector: "app-vehiculo",
  templateUrl: "./vehiculo.component.html",
  styleUrls: ["./vehiculo.component.scss"],
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
    MessageService, ConfirmationService
  ]
})

export class VehiculoComponent implements OnInit {

  titulo: string = 'Vehiculo';
  texto: string = 'vehiculo';
  model: any = 'vehiculos';
  idData?: number = undefined;
  form!: FormGroup;
  data: any = {};
  vehicleData: any = {};
  estatus: any[] = [
    { name: "Activo", value: true },
    { name: "Suspendido", value: false }
  ];
  duenios = Array.from({ length: 10 }, (_, i) => ({
    name: `${i + 1} dueño${i + 1 > 1 ? 's' : ''}`,
    value: i + 1
  }));
  private subs: Subscription[] = [];
  urlPage: string = './dashboard/catalogos/vehiculos/lista';


  constructor(
    private router: ActivatedRoute,
    private routerBack: Router,
    private fb: FormBuilder,
    private servicio: DatarealtimeService,
    private messageService: MessageService,
    private servicioGeneral: ServicioGeneralService
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      disabled: new FormControl(''),
      tipo: new FormControl(''),
      anio: new FormControl(''),
      vin: new FormControl(''),
      numero_duenos: new FormControl(''),
      origen: new FormControl(''),
      nombre_ultimo_duenio: new FormControl(''),
      modelo: new FormControl(''),
      marca: new FormControl('', Validators.required),
      km: new FormControl(''),
      precio: new FormControl(''),
      numero_motor: new FormControl(''),
      numero_serie: new FormControl('')
    });
    
    this.subs.push(this.router.params.subscribe(
      response => {
        if (response['id']) {
          this.idData = response['id'];
          this.cargarDatos();
          console.log("0");
        } else {
          this.data.disabled = true;
          console.log("1")
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
   /* this.subs.push(
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
    this.servicioGeneral.get('vehicles', {}, true).subscribe({
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
      this.vehicleData = { 
        brand: this.form.value.marca,
        model: this.form.value.modelo,
        tipo: this.form.value.tipo,
        year: this.form.value.anio,
        vin: this.form.value.vin,
        number_of_owners: this.form.value.numero_duenos,
        last_owners: this.form.value.nombre_ultimo_duenio,
        origin: this.form.value.origen,
        disabled: this.form.value.disabled,
        km: this.form.value.km,
        price: this.form.value.precio,
        engine_number: this.form.value.numero_motor,
        serial_number: this.form.value.numero_serie
      };

    if (this.idData) {
      this.servicioGeneral.update(this.model, this.idData, this.data, true).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'La información fue actualizado correctamente'
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
      this.servicioGeneral.post(this.model, this.data, true).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'La información fue guardado correctamente'
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
    }
  }
}
