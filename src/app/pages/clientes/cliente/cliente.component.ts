import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
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

  guarantors = [{}];
  has_guarantor: boolean = false;
  max_guarantors: number = 3;
  guarantorFormArray!: FormArray;
  customerGuaranteeData: any[] = [];

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
    });

    //crea un formulario vacio para los avales (aqui luego se cargan los datos de los avales en la bd) 
    this.guarantorFormArray = this.fb.array([this.createGuarantorForm(null)]);

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
        console.log("customer data in cargarDatos: ", this.data)

        this.form.patchValue({
          nombre: this.data.name,
          apellido: this.data.last_name,
          celular: this.data.cellphone_number,
          Direction: this.data.address,
        });
        this.servicioGeneral.get(`customer_guarantee`, {}, true).subscribe({
          next: (response: any) => {
            const garanteeList = response.data.filter(
              (item: any) => item.customer_id === this.data.id
            );

            console.log('Relacionados:', garanteeList);

            if (garanteeList.length > 0) {
              //carga los datos de los avales que recibe del filtrado
              for (let i = 0; i < garanteeList.length; i++) {
                this.guarantorFormArray.at(i).patchValue({
                  id: garanteeList[i].id,
                  guarantorName: garanteeList[i].name,
                  guarantorLastName: garanteeList[i].last_name,
                  guarantorDirection: garanteeList[i].address,
                  guarantoremail: garanteeList[i].email,
                  guarantormovil: garanteeList[i].cellphone_number
                });
                this.addGuarantor();
              }
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
    };

    this.customerGuaranteeData = [];
    for (let i = 0; i < this.guarantorFormArray.length; i++) {
      const guarantorFormGroup = this.guarantorFormArray.at(i) as FormGroup;

      if (guarantorFormGroup && guarantorFormGroup.valid) {
        const guarantorData: any = {
          id: guarantorFormGroup.value.id,
          name: guarantorFormGroup.value.guarantorName,
          last_name: guarantorFormGroup.value.guarantorLastName,
          address: guarantorFormGroup.value.guarantorDirection,
          cellphone_number: guarantorFormGroup.value.guarantormovil,
        };

        // Si el aval no tiene un ID (es un aval nuevo), se asigna el email del formulario
        // esto porque mandar un email cuando ya existe un aval causa errores por el validador de email unico
        if (!guarantorData.id) {
          guarantorData.email = guarantorFormGroup.value.guarantoremail;
        }

        this.customerGuaranteeData.push(guarantorData);
      }

    }
    if (!this.pass) {
      delete this.data.password;
    } else {
      this.data.password = this.pass;
      this.data.passwordConfirm = this.pass;
    }
    // Edicion de cliente
    if (this.idData) {
      this.customerData = {
        ...this.customerData,
        has_customer_guarantee: this.has_guarantor,
      }
      this.servicioGeneral.update(this.model, this.idData, this.customerData, true).subscribe({
        next: (data: any) => {

          //se hace update o post de cada aval en los datos
          this.customerGuaranteeData.forEach((guarantor: any, index: number) => {
            guarantor.customer_id = this.idData;
            //edicion del aval
            if (guarantor.id) {
              this.servicioGeneral.update('customer_guarantee', guarantor.id, guarantor, true).subscribe({
                next: (response: any) => {
                  console.log(`Aval ${index + 1} actualizado exitosamente`, response);
                },
                error: (err: any) => {
                  console.error(`Error al actualizar el aval ${index + 1}`, err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo actualizar el aval ${index + 1}`
                  });
                }
              });
            } else {
              //aval nuevo
              this.servicioGeneral.post('customer_guarantee', guarantor, true).subscribe({
                next: (response: any) => {
                  console.log(`Aval ${index + 1} creado exitosamente`, response);
                },
                error: (err: any) => {
                  console.error(`Error al crear el aval ${index + 1}`, err);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo crear el aval ${index + 1}`
                  });
                }
              });
            }

          });
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
      // Cliente nuevo

      this.customerData = {
        ...this.customerData,
        has_customer_guarantee: this.has_guarantor,
      }
      console.log("mega wtf", this.customerData)
      this.servicioGeneral.post(this.model, this.customerData, true).subscribe({
        next: (data: any) => {
          console.log('datos del clientes devuelta por el servidor', data);

          console.log('datos avales:', this.customerGuaranteeData.values);
          this.customerGuaranteeData.forEach((guarantor: any, index: number) => {
            guarantor.customer_id = data.data.id;
            this.servicioGeneral.post('customer_guarantee', guarantor).subscribe({
              next: (response: any) => {
                console.log(`Aval ${index + 1} creado exitosamente`, response);
              },
              error: (err: any) => {
                console.error(`Error al crear el aval ${index + 1}`, err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: `No se pudo crear el aval ${index + 1}`
                });
              }
            });
          });

          const formData = new FormData();
          console.log('DocumentMap:', this.documentMap);
          for (const fileName in this.documentMap) {
            const file = this.documentMap[fileName];
            formData.append(`documents[${fileName}]`, file);
          }
          console.log('FormData:', formData);
          //no implementado en back aun
          /* this.http.put(`localhost:80/api/customer/${data.data.id}/files`, formData).subscribe({
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

    this.routerBack.navigate(['./dashboard/clientes/lista']);
  }

  /** Crea un formulario para un aval con validaciones
   * @param guarantorId - ID del aval, si es nuevo se pasa null
  */
  createGuarantorForm(guarantorId: any): any {
    return this.fb.group({
      id: new FormControl(guarantorId),
      guarantorName: new FormControl('', Validators.required),
      guarantorLastName: new FormControl('', Validators.required),
      guarantorDirection: new FormControl('', Validators.required),
      guarantoremail: new FormControl('', [Validators.email]),
      guarantormovil: new FormControl('', Validators.required)
    });
  }

  /** Crea un nuevo formulario aval al array si el maximo de avales no se ha alcanzado.
   * 
   */
  addGuarantor() {
    if (this.guarantors.length < this.max_guarantors) {
      this.guarantors.push({});
      this.guarantorFormArray.push(this.createGuarantorForm(null));
      this.has_guarantor = true;
    }
  }

  /** Elimina un aval del array, del formulario y de la base de datos si existe (tiene ID).
   * @param index - Índice del aval a eliminar
   */
  removeGuarantor(index: number) {
    if (this.guarantors.length > 0) {
      if (this.guarantorFormArray.at(index).value.id) {
        this.servicioGeneral.delete('customer_guarantee', this.guarantorFormArray.at(index).value.id, true).subscribe({
          next: (response: any) => {
            if (this.guarantorFormArray.length == 0) this.has_guarantor = false;
            console.log('Aval eliminado exitosamente', response);
          },
          error: (err: any) => {
            console.error('Error al eliminar el aval', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el aval'
            });
          }
        });
      }
      this.guarantors.splice(index, 1);
      this.guarantorFormArray.removeAt(index);
    }
  }

  /**
   * @returns true si el número de avales es menor que el máximo permitido, false en caso contrario.
   */
  isAgregable() {
    return this.guarantors.length < this.max_guarantors;
  }

  /**
   * @returns true si hay aval para eliminar, false en caso contrario.
   */
  isEliminable() {
    return this.guarantors.length > 0;
  }

  /**
   * @param index - Índice del aval para obtener su formulario.
   * @returns El formulario del aval correspondiente al índice.
   */
  getGuarantorForm(index: number): FormGroup {
    return this.guarantorFormArray.at(index) as FormGroup;
  }

  /**
   * @returns Los datos de los avales en el formulario como un array de objetos.
   */
  getGuarantorData() {
    return this.guarantorFormArray.value;
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
