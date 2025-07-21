import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { FluidModule } from "primeng/fluid";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { SelectModule } from "primeng/select";
import { DatarealtimeService } from "../../../layout/service/datarealtime.service";
import { Subscription } from "rxjs";
import { TabsModule } from 'primeng/tabs';
import { ClienteService } from "../../../layout/service/cliente.service";
import { Dialog } from "primeng/dialog";
import { TableModule } from 'primeng/table';
import { Knob } from 'primeng/knob';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from "primeng/dropdown";
import { FileUpload, FileUploadModule } from "primeng/fileupload";
import { DatePickerModule } from "primeng/datepicker";
import { ServicioGeneralService } from "../../../layout/service/servicio-general/servicio-general.service";
import Pusher from 'pusher-js';
import { GeneralWebsocketService } from "../../../layout/service/general-websocket.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.scss"],
  standalone: true,
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
    PasswordModule,
    TabsModule,
    TableModule,
    PanelModule,
    DropdownModule,
    FileUploadModule,
    DatePickerModule
  ],
  providers: [
    MessageService
  ]
})

export class ClienteComponent implements OnInit {

  titulo: string = 'Clientes';
  texto: string = 'cliente';
  model: string = 'customers';
  clienteChannelName: string = 'customer';
  avalChannelName: string = 'customer-guarantee';
  inputGroupValue: any;
  idData?: number = undefined;
  form!: FormGroup;
  guarantorForm!: FormGroup;
  guarantorForm2!: FormGroup;
  creditForm!: FormGroup;
  data: any = {};
  customerData: any = {};
  customerGuaranteeData: any = {};
  customerGuaranteeData2: any = {};
  pass: string = '';
  semanas: any = {};
  semanaActiva: number = 0;
  estatus: any[] = [
    { name: "Activo", value: true },
    { name: "Suspendido", value: false }
  ];
  agregarSemana: any = {};
  private subs: Subscription[] = [];
  urlPage: string = './dashboard/clientes/lista';
  visible: boolean = false;
  anio?: number = undefined;
  dias = Array.from({ length: 7 }, (_, i) => ({
    name: (i + 1).toString(),
    value: i + 1
  }));
  fecha1erPago: Date | null = null;
  ajuste: any = {
    proteina: 0,
    grasas: 0,
    carb: 0,
    calorias: 0,
  }
  categorias: any = [];
  uploadedFiles: any[] = [];
  datosCliente: any = null;
  documentMap: { [clave: string]: File } = {};


  constructor(
    private router: ActivatedRoute,
    private routerBack: Router,
    private fb: FormBuilder,
    private servicio: DatarealtimeService,
    private messageService: MessageService,
    private servicioCliente: ClienteService,
    private servicioGeneral: ServicioGeneralService,
    private generalWebsocketService: GeneralWebsocketService,
    private http: HttpClient
  ) {
    
  }

  ngOnInit() {
    this.generalWebsocketService.initPusher(this.clienteChannelName);
    this.generalWebsocketService.initPusher(this.avalChannelName);

    this.form = this.fb.group({
      disabled: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      Direction: new FormControl(''),
      celular: new FormControl(''),
      telefono: new FormControl(''),
    });

    this.guarantorForm = this.fb.group({
      guarantorName: new FormControl('', Validators.required),
      guarantorLastName: new FormControl('', Validators.required),
      guarantorDirection: new FormControl('', Validators.required),
      guarantorcellphone: new FormControl('', Validators.required),
      guarantoremail: new FormControl('', Validators.required),
      guarantormovil: new FormControl('', Validators.required)
    });

    this.guarantorForm2 = this.fb.group({
      guarantorName2: new FormControl('', Validators.required),
      guarantorLastName2: new FormControl('', Validators.required),
      guarantorDirection2: new FormControl('', Validators.required),
      guarantorcellphone2: new FormControl('', Validators.required),
      guarantoremail2: new FormControl('', Validators.required),
      guarantormovil2: new FormControl('', Validators.required)
    });

    this.creditForm = this.fb.group({
      monto: new FormControl('', Validators.required),
      plazo: new FormControl('', Validators.required),
      tasa: new FormControl('', Validators.required),
      enganche: new FormControl('', Validators.required),
      fecha1erPago: new FormControl('', Validators.required),
      FMD: new FormControl('', Validators.required)
    });
    const year = new Date().getFullYear();
    this.anio = year;
    this.semanas = this.servicioCliente.getWeeksOfYear(year);
    this.semanaActiva = this.semanas.currentWeek;
    console.log(this.semanas);
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

  registros: any[] = [];
  promedios: any = {};

  showDialog() {
    this.agregarSemana.idRel_cliente = this.idData;
    this.agregarSemana.anio = this.anio;
    this.agregarSemana.semana = this.semanaActiva;
    this.visible = true;
  }

  /* guardarCalorias() {
    this.servicio.createRecord('semana_clientes', this.agregarSemana).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'Los datos fue guardado correctamente'
        });
        this.visible = false;
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
  } */

  async cargarDatos() {
    this.servicioGeneral.get(`customers/${this.idData}`, {}, true).subscribe({
      next: (data: any) => {
        this.data = data.data;
        console.log(this.data)

        this.form.patchValue({
          nombre: this.data.name,
          apellido: this.data.last_name,
          celular: this.data.cellphone_number,
          Direction: this.data.address,
          telefono: this.data.phone_number
        });
        this.servicioGeneral.get(`customer_guarantee`, {}, true).subscribe({
          next: (response: any) => {
            const garanteeList = response.data.filter(
              (item: any) => item.customer_id === this.data.id
            );

            const garantee = garanteeList[0];
            console.log('Relacionados:', garantee);
            if (garantee) {
              this.guarantorForm.patchValue({
                guarantorName: garantee.name,
                guarantoLastName: garantee.last_name,
                guarantorDirection: garantee.address,
                guarantorcellphone: garantee.phone_number,
                guarantoremail: garantee.email,
                guarantormovil: garantee.cellphone_number
              });
            }

          }
        });

      }

    })
  }



  submitData() {

    this.customerData = { 
      name: this.form.value.nombre,
      last_name: this.form.value.apellido,
      email: this.form.value.email,
      cellphone_number: this.form.value.celular,
      address: this.form.value.Direction,
      phone_number: this.form.value.celular
    };

    this.customerGuaranteeData = {
      name: this.guarantorForm.value.guarantorName,
      last_name: this.guarantorForm.value.guarantorLastName,
      address: this.guarantorForm.value.guarantorDirection,
      phone_number: this.guarantorForm.value.guarantorcellphone,
      cellphone_number: this.guarantorForm.value.guarantormovil,
      email: this.guarantorForm.value.guarantoremail
    }

    this.customerGuaranteeData2 = {
      name: this.guarantorForm2.value.guarantorName2,
      last_name: this.guarantorForm2.value.guarantorLastName2,
      address: this.guarantorForm2.value.guarantorDirection2,
      phone_number: this.guarantorForm2.value.guarantorcellphone2,
      cellphone_number: this.guarantorForm2.value.guarantormovil2,
      email: this.guarantorForm2.value.guarantoremail2
    }

    if (!this.pass) {
      delete this.data.password;
    } else {
      this.data.password = this.pass;
      this.data.passwordConfirm = this.pass;
    }
    if (this.idData) {
      console.log('Entro aqui en edicion');
      
      this.servicioGeneral.update(this.model, this.idData, this.data, true).subscribe({
        next: (data: any) => {
        },
        error: (err: any) => {
          console.error('Error al cargar', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo editar el usuario'
          });
        }
      })
    } else {
      console.log('datos del cliente antes de cargar',this.customerData);
      this.servicioGeneral.post(this.model, this.customerData, true).subscribe({
        next: (data: any) => {
          console.log('datos del clientes decuelta por el servidor',data);
          this.customerGuaranteeData.customer_id = data.data.id;
          this.customerGuaranteeData2.customer_id = data.data.id;
          console.log('datos del aval',this.customerGuaranteeData);
          this.servicioGeneral.post('customer_guarantee', this.customerGuaranteeData).subscribe({
            next: (data: any) => {
            },
            error: (err: any) => {
              console.error('Error al cargar', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear el aval'
              });
            }
          })
          console.log('Data 2:',this.customerGuaranteeData2);
          
          this.servicioGeneral.post('customer_guarantee', this.customerGuaranteeData2).subscribe({
            next: (data: any) => {
            },
            error: (err: any) => {
              console.error('Error al cargar', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear el aval'
              });
            }
          })
          const formData = new FormData();
          console.log('DocumentMap:', this.documentMap);
          for (const fileName in this.documentMap) {
            const file = this.documentMap[fileName];
            formData.append(`documents[${fileName}]`, file);
          }
          console.log('FormData:',formData);
          this.http.put(`localhost:80/api/customer/${data.data.id}/files`, formData).subscribe({
            next: (data: any) => {
            },
            error: (err: any) => {
              console.error('Error al cargar', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear el aval'
              });
            }
          });
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

    this.routerBack.navigate(['./dashboard/clientes/lista']);
  }

  onFilesSelected(event: any) {
    console.log('Me seleccionaron');
    
    const files: File[] = Array.from(event.files);

    /* for (let file of files) {
      const fileName = file.name;
      this.documentMap[fileName] = file;
    } */
    files.forEach((file: File) => {
      this.documentMap[file.name] = file;
    });
    this.updateUploadedFiles();

    this.uploadedFiles = Object.values(this.documentMap);
  }

  uploadFiles(event: any) {
    const archivosSeleccionados: File[] = event.files;

    console.log('Subiendo archivos:', archivosSeleccionados);

    /* this.servicio.uploadConFoto('clientes', 'documents', this.data, archivosSeleccionados)
      .subscribe({
        next: res => {
          console.log('Subido exitosamente', res);
        },
        error: err => console.error('Error al subir', err)
      }); */
  }

  // Añade este método para manejar la eliminación
  onFileRemoved(event: { file: File }) {
    delete this.documentMap[event.file.name];
    this.updateUploadedFiles();
  }

  // Actualiza la lista visual
  private updateUploadedFiles() {
    this.uploadedFiles = Object.values(this.documentMap);
  }

  /* onFilesSelected(event: any) {
    this.uploadedFiles = [...this.uploadedFiles, ...event.files];
  } */

  onRemove(event: any) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== event.file.name);
  }

  onClearFiles() {
    this.uploadedFiles = [];
  }

  removeUploadedFileCallback = (index: number) => {
    this.removeUploadedFile(index);
  }

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  removeUploadedFile(index: number) {
    this.fileUpload.files.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
  }

  /* onFileRemoved(event: any) {
    const removedFile: File = event.file;

    const index = this.uploadedFiles.findIndex(file =>
      file.name === removedFile.name && file.size === removedFile.size
    );

    if (index !== -1) {
      this.removeUploadedFileCallback(index);
    }
  } */
}
