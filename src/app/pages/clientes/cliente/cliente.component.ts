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
  inputGroupValue: any;
  idData?: number = undefined;
  form!: FormGroup;
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
  categorias: any = [];
  uploadedFiles: any[] = [];
  datosCliente: any = null;
  documentMap: { [clave: string]: File } = {};

  estadosCiviles = [
    { label: 'Soltero', value: 'soltero' },
    { label: 'Casado', value: 'casado' },
    { label: 'Divorciado', value: 'divorciado' },
    { label: 'Viudo', value: 'viudo' }
  ];

  estadosCivilesAval = [
    { label: 'Soltero', value: 'soltero' },
    { label: 'Casado', value: 'casado' },
    { label: 'Divorciado', value: 'divorciado' },
    { label: 'Viudo', value: 'viudo' }
  ];
  opcionesDependientes = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ];
  tiposTrabajo = [
    { label: 'Empleado', value: false },
    { label: 'Independiente', value: true },
  ];
  tiposVivienda = [
    { label: 'Hipoteca Infonavit', value: 'hipoteca_infonavit' },
    { label: 'Hipoteca Banco', value: 'hipoteca_banco' },
    { label: 'Donación', value: 'donacion' },
    { label: 'Usufructo', value: 'usufructo' },
    { label: 'Rentada', value: 'rentada' },
    { label: 'Familiar', value: 'familiar' },
    { label: 'Otros', value: 'otro' },
  ];

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
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      cellphone_number: new FormControl(null, Validators.required),
      RFC: new FormControl('', Validators.required),
      has_customer_guarantee: this.has_guarantor,
      documents: (null),

      marital_status: new FormControl('', Validators.required),
      marriage_regime: new FormControl(null),
      marriage_place: new FormControl(null),
      economic_dependents: new FormControl(null, Validators.required),
      number_children: new FormControl(null),
      age_of_children: new FormControl(null),

      couple_name: new FormControl(null),
      couple_phone_number: new FormControl(null),
      couple_job: new FormControl(null),
      couple_industry: new FormControl(null),
      couple_monthly_income: new FormControl(null),

      age: new FormControl(null, Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      type_housing: new FormControl(null, Validators.required),
      residence_time: new FormControl(null, Validators.required),
      CP: new FormControl('', Validators.required),

      rent_price: new FormControl(''),
      extra_name: new FormControl(''),
      extra_phone_number: new FormControl(''),
      familiar_relationship: new FormControl(''),

      company: new FormControl('', Validators.required),
      company_adress: new FormControl('', Validators.required),
      company_phone_number: new FormControl(null, Validators.required),
      monthly_income: new FormControl(null, Validators.required),
      another_incomes: new FormControl(null),
      job: new FormControl('', Validators.required),
      job_seniority: new FormControl(null, Validators.required),
      last_job: new FormControl(null),
      last_job_seniority: new FormControl(null),
      last_phone_number: new FormControl(null),
      isOwner: new FormControl(null, Validators.required),
      immediate_supervisor_name: new FormControl(null),
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

  registros: any[] = [];
  promedios: any = {};

  showDialog() {
    this.agregarSemana.idRel_cliente = this.idData;
    this.agregarSemana.anio = this.anio;
    this.agregarSemana.semana = this.semanaActiva;
    this.visible = true;
  }

  async cargarDatos() {
    this.servicioGeneral.get(`customers/${this.idData}`, {}, true).subscribe({
      next: (data: any) => {
        this.data = data.data;
        console.log(this.data)

        this.form.patchValue({
          name: this.data.name,
          last_name: this.data.last_name,
          address: this.data.address,
          cellphone_number: this.data.cellphone_number,
          email: this.data.email,
          age: this.data.age,

          marital_status: this.data.marital_status,
          marriage_regime: this.data.marriage_regime,
          marriage_place: this.data.marriage_place,
          economic_dependents: this.data.economic_dependents == 1 ? true : false,
          number_children: this.data.number_children,
          job: this.data.job,

          couple_name: this.data.couple_name,
          couple_phone_number: this.data.couple_phone_number,
          couple_job: this.data.couple_job,
          couple_industry: this.data.couple_industry,
          couple_monthly_income: this.data.couple_monthly_income,

          RFC: this.data.RFC,
          city: this.data.city,
          state: this.data.state,
          type_housing: this.data.type_housing,
          residence_time: this.data.residence_time,
          rent_price: this.data.rent_price,
          extra_name: this.data.extra_name,
          extra_phone_number: this.data.extra_phone_number,
          familiar_relationship: this.data.familiar_relationship,

          company: this.data.company,
          company_adress: this.data.company_adress,
          company_phone_number: this.data.company_phone_number,
          monthly_income: this.data.monthly_income,
          another_incomes: this.data.another_incomes,
          immediate_supervisor_name: this.data.immediate_supervisor_name,
          job_seniority: this.data.job_seniority,
          last_job: this.data.last_job,
          last_job_seniority: this.data.last_job_seniority,
          last_phone_number: this.data.last_phone_number,
          age_of_children: this.data.age_of_children,
          CP: this.data.CP,
          isOwner: this.data.isOwner == 1 ? true : false,

          has_customer_guarantee: this.data.has_customer_guarantee,
        });
        this.servicioGeneral.get(`customer_guarantee`, {}, true).subscribe({
          next: (response: any) => {
            const garanteeList = response.data.filter(
              (item: any) => item.customer_id === this.data.id
            );

            if (garanteeList.length > 0) {
              //carga los datos de los avales que recibe del filtrado
              garanteeList.forEach((guarantee: any, index: number) => {
                this.guarantorFormArray.at(index).patchValue({
                  id: guarantee.id,
                  guarantorName: guarantee.name,
                  guarantorLastName: guarantee.last_name,
                  guarantorDirection: guarantee.address,
                  guarantoremail: guarantee.email,
                  guarantormovil: guarantee.cellphone_number
                });
              })
              this.has_guarantor = true;
            } else {
              this.addGuarantor();
            }
          }
        });
      }
    })
  }

  submitData() {
    this.has_guarantor = this.guarantorFormArray.controls.some(form => form.valid);

    this.customerData = {
      name: this.form.value.name,
      last_name: this.form.value.last_name,
      email: this.form.value.email,
      cellphone_number: this.form.value.cellphone_number,
      address: this.form.value.address,
      age: this.form.value.age,

      marital_status: this.form.value.marital_status,
      marriage_regime: this.form.value.marriage_regime,
      marriage_place: this.form.value.marriage_place,
      economic_dependents: this.form.value.economic_dependents == 1 ? true : false,
      number_children: this.form.value.number_children,
      job: this.form.value.job,

      couple_name: this.form.value.couple_name,
      couple_phone_number: this.form.value.couple_phone_number,
      couple_job: this.form.value.couple_job,
      couple_industry: this.form.value.couple_industry,
      couple_monthly_income: this.form.value.couple_monthly_income,

      RFC: this.form.value.RFC,
      city: this.form.value.city,
      state: this.form.value.state,
      type_housing: this.form.value.type_housing,
      residence_time: this.form.value.residence_time,
      rent_price: this.form.value.rent_price,
      extra_name: this.form.value.extra_name,
      extra_phone_number: this.form.value.extra_phone_number,
      familiar_relationship: this.form.value.familiar_relationship,

      company: this.form.value.company,
      company_adress: this.form.value.company_adress,
      company_phone_number: this.form.value.company_phone_number,
      monthly_income: this.form.value.monthly_income,
      another_incomes: this.form.value.another_incomes,
      immediate_supervisor_name: this.form.value.immediate_supervisor_name,
      job_seniority: this.form.value.job_seniority,
      last_job: this.form.value.last_job,
      last_job_seniority: this.form.value.last_job_seniority,
      last_phone_number: this.form.value.last_phone_number,
      age_of_children: this.form.value.age_of_children,
      CP: this.form.value.CP,
      isOwner: this.form.value.isOwner == 1 ? true : false,

      has_customer_guarantee: this.has_guarantor,
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
          age: guarantorFormGroup.value.age,

          marital_status: guarantorFormGroup.value.marital_status,
          marital_regime: guarantorFormGroup.value.marital_regime,
          marriage_place: guarantorFormGroup.value.marriage_place,
          economic_dependents: guarantorFormGroup.value.economic_dependents,
          number_children: guarantorFormGroup.value.number_children,
          job: guarantorFormGroup.value.job,

          couple_name: guarantorFormGroup.value.couple_name,
          couple_phone_number: guarantorFormGroup.value.couple_phone_number,
          couple_job: guarantorFormGroup.value.couple_job,
          couple_industry: guarantorFormGroup.value.couple_industry,
          couple_monthly_income: guarantorFormGroup.value.couple_monthly_income,

          city: guarantorFormGroup.value.city,
          state: guarantorFormGroup.value.state,
          type_housing: guarantorFormGroup.value.type_housing,
          residence_time: guarantorFormGroup.value.residence_time,
          CP: guarantorFormGroup.value.CP,

          rent_price: guarantorFormGroup.value.rent_price,
          extra_name: guarantorFormGroup.value.extra_name,
          extra_phone_number: guarantorFormGroup.value.extra_phone_number,
          familiar_relationship: guarantorFormGroup.value.familiar_relationship,

          company: guarantorFormGroup.value.company,
          company_address: guarantorFormGroup.value.company_adress,
          company_phone_number: guarantorFormGroup.value.company_phone_number,
          monthly_income: guarantorFormGroup.value.monthly,
          another_incomes: guarantorFormGroup.value.another_incomes,
          job_seniority: guarantorFormGroup.value.job_seniority,
          last_job: guarantorFormGroup.value.last_job,
          last_job_seniority: guarantorFormGroup.value.last_job_seniority,
          last_phone_number: guarantorFormGroup.value.last_phone_number,
          isOwner: guarantorFormGroup.value.isOwner == 1 ? true : false,
          immediate_supervisor_name: guarantorFormGroup.value.immediate_supervisor_name,
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
      guarantorName: new FormControl('',),
      guarantorLastName: new FormControl('',),
      guarantorDirection: new FormControl('',),
      guarantoremail: new FormControl('',),
      age: new FormControl(''),
      marital_status: new FormControl(''),

      couple_name: new FormControl(''),
      marriage_place: new FormControl(''),
      marriage_regime: new FormControl(''),

      city: new FormControl(''),
      state: new FormControl(''),
      CP: new FormControl(''),
      guarantormovil: new FormControl('',),

      type_housing_paid: new FormControl<string | null>(''),
      address_paid: new FormControl(''),
      type_housing_paying: new FormControl<string | null>(''),
      address_payment: new FormControl(''),

      mortgage_date: new FormControl(''),
      final_comments: new FormControl(''),

      company: new FormControl(''),
      job_type: new FormControl(''),
      company_address: new FormControl(''),
      position: new FormControl(''),
      immediate_supervisor_name: new FormControl(''),
      job: new FormControl(''),
      another_job_industry: new FormControl(''),
      monthly_income: new FormControl(null),
      another_incomes: new FormControl(null),
      job_seniority: new FormControl(''),
      company_phone_number: new FormControl(''),
      isOwner: new FormControl(null),
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
