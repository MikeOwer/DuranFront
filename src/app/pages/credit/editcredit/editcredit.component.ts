import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from "rxjs";
import { DatarealtimeService } from "../../../layout/service/datarealtime.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Tab, TabsModule } from 'primeng/tabs';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ServicioGeneralService } from '../../../layout/service/servicio-general/servicio-general.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../layout/service/auth.service';
import { GeneralWebsocketService } from "../../../layout/service/general-websocket.service";
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'app-editcredit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    TableModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    StepsModule,
    ToastModule,
    ReactiveFormsModule,
    TabsModule,
    TabViewModule,
    DropdownModule,
    DatePickerModule,
    CheckboxModule,
    InputNumberModule

  ],
  templateUrl: './editcredit.component.html',
  styleUrl: './editcredit.component.scss',
  providers: [MessageService]
})
export class EditcreditComponent implements OnInit {
  form!: FormGroup;
  formStep2!: FormGroup;
  formStep3!: FormGroup;
  formMarca!: FormGroup;
  formReferencias!: FormGroup;
  formStep6!: FormGroup;
  activeIndex: number = 0;
  private subs: Subscription[] = [];
  model: any = 'credito';
  data: any = {};
  dataApprove: any = {};
  idData?: number;
  creditoChannelName: string = 'credito';
  urlPage: string = './dashboard/credito';
  titulo: string = 'Crédito'
  items: any[] = [
    { label: 'Cliente' },
    { label: 'Aval' },
    { label: 'Crédito' }
  ];
  clientes: any = {};
  vehiculos: any[] = [];
  avales: any[] = [];
  clienteDialog: boolean = false;
  vehiculoDialog: boolean = false;
  searchCliente: string = '';
  searchVehiculo: string = '';
  showGuarantorDialog: boolean = false;
  possibleGuarantors: any[] = [];
  clienteid: string = "";
  selectedGuarantors: any[] = [];

  vehiculoid: string = "";
  vehiculoSeleccionado: any;
  modo: 'nuevo' | 'cotizar' | 'editar' = 'nuevo';

  sucursales: any[] = [];
  sucursalSeleccionada: any = null;
  inversionistas: any[] = [];
  inversionistaSeleccionado: any = null;
  idCustomer: string = "";
  has_guarantor: boolean = false;
  idGuarantor: string = "";
  idReference: string = "";
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
  constructor(
    private fb: FormBuilder,
    private servicio: DatarealtimeService,
    private messageService: MessageService,
    private router: ActivatedRoute,
    private routerBack: Router,
    private servicioGeneral: ServicioGeneralService,
    private sanitizer: DomSanitizer,
    private routerUrl: Router,
    public authService: AuthService,
    private generalWebsocketService: GeneralWebsocketService,
  ) { }

  ngOnInit(): void {

    this.generalWebsocketService.initPusher(this.creditoChannelName);
    const url = this.routerUrl.url;

    if (url.includes('cotizar')) {
      this.modo = 'cotizar';
      this.data.etapa = 'cotizacion'
    } else if (url.includes('editar')) {
      this.modo = 'editar';
      this.servicioGeneral.get('sucursal', {}, false).subscribe({
        next: (data) => {
          this.sucursales = data.data;
          console.log('Sucursales:', this.sucursales);
        }
      })
      this.servicioGeneral.get('investor_catalog', {}, false).subscribe({
        next: (data) => {
          this.inversionistas = data.data;
          console.log('Inversionistas:', this.inversionistas);
        }
      })
    } else {
      this.modo = 'nuevo';
    }

    console.log("modo: ", this.modo)
    this.initializeForms();
    this.subs.push(this.router.params.subscribe(
      response => {
        if (response['id']) {
          this.idData = response['id'];
          this.cargarDatos();
        } else {
          this.data.disabled = true;
        }
      }
    ))
  }

  onBack() {
    this.routerBack.navigate([this.urlPage]);
  }

  initializeForms(): void {
    //form info cliente
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      cellphone_number: new FormControl(null, Validators.required),
      RFC: new FormControl('', Validators.required),
      has_customer_guarantee: this.has_guarantor,
      documents: (null),

      marital_status: new FormControl(''),
      marriage_regime: new FormControl(null),
      marriage_place: new FormControl(null),
      economic_dependents: new FormControl(null),
      number_children: new FormControl(null),
      age_of_children: new FormControl(null),

      couple_name: new FormControl(null),
      couple_phone_number: new FormControl(null),
      couple_job: new FormControl(null),
      couple_industry: new FormControl(null),
      couple_monthly_income: new FormControl(null),

      age: new FormControl(null),
      city: new FormControl(''),
      state: new FormControl(''),
      type_housing: new FormControl(null),
      residence_time: new FormControl(null),
      CP: new FormControl(''),

      company: new FormControl(''),
      company_adress: new FormControl(''),
      company_phone_number: new FormControl(),
      monthly_income: new FormControl(null),
      another_incomes: new FormControl(null),
      job: new FormControl(''),
      job_seniority: new FormControl(null),
      last_job: new FormControl(null),
      last_job_seniority: new FormControl(null),
      last_phone_number: new FormControl(null),
      isOwner: new FormControl(null),
      immediate_supervisor_name: new FormControl(null),
    });

    //form avales
    this.formStep2 = this.fb.group({
      name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      age: new FormControl(null, Validators.required),
      marital_status: new FormControl(''),

      couple_name: new FormControl(''),
      marriage_place: new FormControl(''),
      marriage_regime: new FormControl(''),

      address: new FormControl('', Validators.required),
      city: new FormControl(''),
      state: new FormControl(''),
      CP: new FormControl(''),
      cellphone_number: new FormControl(null, Validators.required),

      type_housing_paid: new FormControl<string | null>(null),
      address_paid: new FormControl(''),
      type_housing_paying: new FormControl<string | null>(null),
      address_payment: new FormControl(''),

      mortgage_date: new FormControl(''),
      final_comments: new FormControl(''),

      company: new FormControl(''),
      job_type: new FormControl(''),
      company_address: new FormControl(''),
      position: new FormControl(''),
      boss: new FormControl(''),
      job: new FormControl(''),
      another_job_industry: new FormControl(''),
      monthly_income: new FormControl(null),
      another_incomes: new FormControl(null),
      job_seniority: new FormControl(''),
      company_phone_number: new FormControl(''),
      isOwner: new FormControl(null),
    });

    //Form datos crédito
    this.formStep3 = this.fb.group({
      interes: new FormControl('', Validators.required),
      plazo: new FormControl('', Validators.required),
      iva: new FormControl(false, Validators.required),
      enganche: new FormControl('', Validators.required),
      tasa_fmd: new FormControl('5.00', Validators.required),
      fecha_inicial: new FormControl(null, Validators.required),
      sucursalSeleccionada: new FormControl('1', Validators.required),
      inversionistaSeleccionado: new FormControl('1', Validators.required),
    });

    this.formMarca = this.fb.group({
      marca: new FormControl('', Validators.required),
      modelo: new FormControl('', Validators.required),
      anio: new FormControl('', Validators.required),
      color: new FormControl('', Validators.required),
      numero_serie: new FormControl('', Validators.required),
      numero_motor: new FormControl('', Validators.required),
      placas: new FormControl('', Validators.required),
      km: new FormControl('', Validators.required),
      montoLista: new FormControl('', Validators.required),
      monto: new FormControl('', Validators.required),
    });

    this.formReferencias = this.fb.group({
      commercial_name: new FormControl('a', Validators.required),
      commercial_phone_number: new FormControl(2222222223, Validators.required),
      second_commercial_name: new FormControl('a', Validators.required),
      second_commercial_phone_number: new FormControl(3333333333, Validators.required),

      personal_name: new FormControl('a', Validators.required),
      personal_phone_number: new FormControl(3333333331, Validators.required),
      personal_cellphone_number: new FormControl(3333333332, Validators.required),
      personal_years_known: new FormControl(2, Validators.required),
      second_personal_name: new FormControl('a', Validators.required),
      second_personal_phone_number: new FormControl(4444444444, Validators.required),
      second_personal_cellphone_number: new FormControl(4444444441, Validators.required),
      second_personal_years_known: new FormControl(1, Validators.required),

      family_name: new FormControl('a', Validators.required),
      family_phone_number: new FormControl(4444444442, Validators.required),
      family_cellphone_number: new FormControl(4444444443, Validators.required),
      family_relationship: new FormControl('a', Validators.required),
      second_family_name: new FormControl('a', Validators.required),
      second_family_phone_number: new FormControl(5555555555, Validators.required),
      second_family_cellphone_number: new FormControl(5555555551, Validators.required),
      second_family_relationship: new FormControl('a', Validators.required),
    });

    //Cotizacion
    this.formStep6 = this.fb.group({
      fecha_inicial: new FormControl({ value: null, disabled: true }),

      monto: new FormControl(''),
      plazo: new FormControl(''),
      interes: new FormControl(''),
      iva: new FormControl(''),

      pago_interes: new FormControl(''),
      pago_capital: new FormControl(''),
      pago_mensual: new FormControl(''),
      moratorio_mensual: new FormControl(''),
      moratorio_diario: new FormControl(''),
    });
  }

  prevStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  async submitForm(): Promise<void> {

    this.has_guarantor = this.formStep2.valid;
    console.log(this.form.value);
    console.log(this.formStep2.value);
    console.log(this.formStep3.value);
    console.log(this.formMarca.value);
    console.log((this.form.valid && this.formStep2.valid && this.formStep3.valid && this.formMarca.valid));
    console.log(this.form.valid, this.formStep2.valid, this.formStep3.valid, this.formMarca.valid);

    if (this.form.valid && this.formStep2.valid && this.formStep3.valid && this.formMarca.valid) {
      try {
        this.data = {
          ...this.data,
          interes: this.formStep3.value.interes,
          plazo: this.formStep3.value.plazo,
          IVA: this.formStep3.value.iva,
          enganche: this.formStep3.value.enganche,
          tasa_fmd: this.formStep3.value.tasa_fmd,
          fecha_inicial: this.formStep3.value.fecha_inicial.toISOString().split('T')[0],
          sucursal_id: this.formStep3.value.sucursalSeleccionada,
          investor_catalog_id: this.formStep3.value.inversionistaSeleccionado,
        };

        console.log('Data completa en submitForm de editCreditComponent:', this.data);
        // 4. Crear o actualizar el crédito
        //Es credito existente
        if (this.idData) {
          this.servicioGeneral.update(this.model, this.idData, this.data, true).subscribe({
            next: (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'El crédito fue actualizado correctamente'
              });
            },
            error: (err: any) => {
              console.error('Error al actualizar crédito', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el crédito'
              });
            }
          });

          this.servicioGeneral.get(`credito/${this.idData}`, {}, false).subscribe({
            next: (data: any) => {
              console.log('Datos del crédito actualizado:', data);
            },
          });
        } else {//crédito nuevo
          this.modo === 'cotizar' ? this.data.etapa = 'cotizacion' : this.data.etapa = 'aprobacion';

          const vehiclePrice = { price: this.formMarca.value.monto }
          console.log('VehicleID en credito', this.data.vehicle_id);

          this.servicioGeneral.update('vehicles/price/' + this.data.vehicle_id, this.data.vehicle_id, vehiclePrice, false).subscribe({
            next: (data: any) => {
            },
            error: (err: any) => {
              console.error('Error al setear precio', err);
            }
          })

          //Cotizacion para cliente existente
          if (this.data.customer_id) {
            this.servicioGeneral.update('customers', this.data.customer_id, { ...this.form.value, has_customer_guarantee: this.has_guarantor }).subscribe({
              next: (customerData: any) => {
                this.idCustomer = customerData.data.id;
                console.log('cliente actualizado: ', customerData);
                const customerGuarantee = {
                  customer_id: this.idCustomer,
                  ...this.formStep2.value,
                }
                this.servicioGeneral.update('customer_guarantee', customerGuarantee.data.id, customerGuarantee).subscribe({
                  next: (guarantorData: any) => {
                    console.log("aval actualizado: ", guarantorData);
                    this.idGuarantor = guarantorData.id;

                    this.servicioGeneral.post('reference', this.formReferencias.value, true).subscribe({
                      next: (referenceData: any) => {
                        console.log('Referencia actualizada:', referenceData);
                        this.idReference = referenceData.data.id;

                        this.servicioGeneral.post('credit_application', {
                          customer_id: this.idCustomer,
                          sucursal_id: 1,
                          reference_id: this.idReference,
                          vehicle_id: this.data.vehicle_id,
                        }, true).subscribe({
                          next: (creditApplicationData: any) => {
                            console.log('Solicitud de crédito creada:', creditApplicationData);
                            this.data = {
                              ...this.data,
                              credit_application_id: creditApplicationData.data.id,
                              customer_id: creditApplicationData.data.customer_id,
                              customer_guarantee_id: creditApplicationData.data.customer_guarantees.id,

                            }
                            console.log("data para crear credit", this.data)

                            this.servicioGeneral.post(this.model, this.data, false).subscribe({
                              next: (creditData: any) => {
                                console.log('Crédito creado:', creditData);
                                this.messageService.add({
                                  severity: 'success',
                                  summary: '¡Éxito!',
                                  detail: 'El crédito fue creado correctamente'
                                });
                                this.idData = creditData.data.id;
                                this.cargarDatosFinancieros();
                                this.goToNextTab();
                              },
                              error: (err: any) => {
                                console.error('Error al crear crédito', err);
                                this.messageService.add({
                                  severity: 'error',
                                  summary: 'Error',
                                  detail: 'No se pudo crear el crédito'
                                });
                              }
                            });

                          }
                        });
                      }
                    });
                  }
                })
              }
            })

          } else {//credito para cliente nuevo
            this.servicioGeneral.post('customers', { ...this.form.value, has_customer_guarantee: this.has_guarantor }, true).subscribe({
              next: (customerData: any) => {
                console.log('Cliente creado:', customerData);
                this.idCustomer = customerData.data.id;
                const customerGuarantee = {
                  customer_id: this.idCustomer,
                  ...this.formStep2.value,
                }
                this.servicioGeneral.post('customer_guarantee', customerGuarantee, true).subscribe({
                  next: (guarantorData: any) => {
                    console.log('Aval creado:', guarantorData);
                    this.idGuarantor = guarantorData.id;
                    this.servicioGeneral.post('reference', this.formReferencias.value, true).subscribe({
                      next: (referenceData: any) => {
                        console.log('Referencia creada:', referenceData);
                        this.idReference = referenceData.data.id;

                        this.servicioGeneral.post('credit_application', {
                          customer_id: this.idCustomer,
                          sucursal_id: 1,
                          reference_id: this.idReference,
                          vehicle_id: this.data.vehicle_id,
                          customer_guarantee: guarantorData,
                        }, true).subscribe({
                          next: (creditApplicationData: any) => {
                            console.log('Solicitud de crédito creada:', creditApplicationData);
                            this.data = {
                              ...this.data,
                              credit_application_id: creditApplicationData.data.id,
                              customer_id: creditApplicationData.data.customer_id,
                            }
                            console.log("data para crear credit", this.data)

                            this.servicioGeneral.post(this.model, this.data, false).subscribe({
                              next: (creditData: any) => {
                                console.log('Crédito creado:', creditData);
                                this.messageService.add({
                                  severity: 'success',
                                  summary: '¡Éxito!',
                                  detail: 'El crédito fue creado correctamente'
                                });
                                this.idData = creditData.data.id;
                                this.cargarDatosFinancieros();
                                this.goToNextTab();
                              },
                              error: (err: any) => {
                                console.error('Error al crear crédito', err);
                                this.messageService.add({
                                  severity: 'error',
                                  summary: 'Error',
                                  detail: 'No se pudo crear el crédito'
                                });
                              }
                            });

                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
      } catch (error) {
        console.error('Error al actualizar cliente o aval', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar cliente o aval'
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }

    //this.routerBack.navigate(['./dashboard/credito']);
  }

  async cargarDatosFinancieros() {
    this.servicioGeneral.get(`credito/${this.idData}`, {}, false).subscribe((creditoRes: any) => {
      console.log("creditoRes:", creditoRes.data)
      const credito = creditoRes.data;
      this.formStep6.patchValue({
        monto: credito.monto,
        plazo: credito.plazo,
        interes: credito.interes,
        iva: credito.iva,

        pago_interes: credito.pago_interes,
        pago_capital: credito.pago_capital,
        pago_mensual: credito.pago_mensual,
        moratorio_mensual: +credito.pago_capital + +credito.pago_mensual,
        moratorio_diario: credito.moratorio_diario,

        fecha_inicial: credito.fecha_inicial ? new Date(credito.fecha_inicial) : null,
      })
    });
  }

  onSearch(): void {
    this.servicioGeneral.get('customers', {}, true).subscribe((clientes: any) => {
      this.clientes = clientes.data;
      console.log('Clientes:', clientes.data);
      this.clienteDialog = true;
    });
  }

  onSearchvehicules(): void {
    this.servicioGeneral.get('vehicles', {}, true).subscribe((vehiculos: any) => {
      console.log(vehiculos);
      this.vehiculos = vehiculos.data;
      this.vehiculoDialog = true;
    });
  }

  onSearchGuaranties(): void {
    this.servicioGeneral.get('customer_guarantee', {}, true).subscribe((aval: any) => {
      console.log(aval);
      this.avales = aval.data;
      this.showGuarantorDialog = true;
    });
  }

  onSucursalChange(event: any) {
    this.sucursalSeleccionada = event.value;
    this.formStep3.patchValue({
      sucursalSeleccionada: this.sucursalSeleccionada
    })
  }

  onInversionistaChange(event: any) {
    this.inversionistaSeleccionado = event.value;
    this.formStep3.patchValue({
      inversionistaSeleccionado: this.inversionistaSeleccionado,
    });
  }

  async seleccionarCliente(cliente: any) {
    this.data.customer_id = cliente.id;

    this.form.patchValue({
      name: cliente.name,
      last_name: cliente.last_name,
      address: cliente.address,
      email: cliente.email,
      cellphone_number: cliente.cellphone_number,
      has_customer_guarantee: cliente.has_customer_guarantee,
    });

    this.clienteid = cliente.id;
    this.clienteDialog = false;
  }


  async seleccionarVehiculo(vehiculo: any) {
    this.data.vehicle_id = vehiculo.id;
    this.vehiculoSeleccionado = vehiculo;
    this.formMarca.patchValue({
      marca: vehiculo.brand,
      modelo: vehiculo.model,
      anio: vehiculo.year,
      color: vehiculo.color,
      numero_serie: vehiculo.serial_number,
      numero_motor: vehiculo.engine_number,
      km: vehiculo.km,
      placas: vehiculo.car_plate,
      montoLista: vehiculo.list_price,
      monto: vehiculo.price,
    });
    this.vehiculoid = vehiculo.id;
    this.vehiculoDialog = false;
  }

  async cargarDatos() {

    this.servicioGeneral.get(`credito/${this.idData}`, {}, false).subscribe((creditoRes: any) => {
      const credito = creditoRes.data;
      this.data.etapa = credito.etapa;

      this.servicioGeneral.get('customers', {}, false).subscribe((clientes: any) => {
        const customersList = clientes.data;
        const cliente = customersList.find((c: any) => c.id === credito.customer_id);

        this.servicioGeneral.get('customer_guarantee', {}, false).subscribe((guarantees: any) => {
          const guaranteesList = guarantees.data;
          const guarantee = guaranteesList.find((g: any) => g.customer_id === credito.customer_id);
          this.data = {
            ...credito,
            cliente: cliente || null,
            guarantee: guarantee || null
          };

          console.log('datos completos de credito en onInit de edit credit component', this.data);
          this.form.patchValue({
            name: this.data.cliente.name,
            last_name: this.data.cliente.last_name,
            address: this.data.cliente.address,
            cellphone_number: this.data.cliente.cellphone_number,
            email: this.data.cliente.email,
            age: this.data.cliente.age,

            marital_status: this.data.cliente.marital_status,
            marriage_regime: this.data.cliente.marriage_regime,
            marriage_place: this.data.cliente.marriage_place,
            economic_dependents: this.data.cliente.economic_dependents == 1 ? true : false,
            number_children: this.data.cliente.number_children,
            job: this.data.cliente.job,

            couple_name: this.data.cliente.couple_name,
            couple_phone_number: this.data.cliente.couple_phone_number,
            couple_job: this.data.cliente.couple_job,
            couple_industry: this.data.cliente.couple_industry,
            couple_monthly_income: this.data.cliente.couple_monthly_income,

            RFC: this.data.cliente.RFC,
            company: this.data.cliente.company,
            company_adress: this.data.cliente.company_adress,
            company_phone_number: this.data.cliente.company_phone_number,
            city: this.data.cliente.city,
            state: this.data.cliente.state,
            type_housing: this.data.cliente.type_housing,
            residence_time: this.data.cliente.residence_time,
            monthly_income: this.data.cliente.monthly_income,
            another_incomes: this.data.cliente.another_incomes,
            job_seniority: this.data.cliente.job_seniority,
            last_job: this.data.cliente.last_job,
            last_job_seniority: this.data.cliente.last_job_seniority,
            last_phone_number: this.data.cliente.last_phone_number,
            age_of_children: this.data.cliente.age_of_children,
            CP: this.data.cliente.CP,
            isOwner: this.data.cliente.isOwner == 1 ? true : false,

            has_customer_guarantee: this.data.cliente.has_customer_guarantee,
          });

          this.formStep2.patchValue({
            name: this.data.guarantee.name,
            last_name: this.data.guarantee.last_name,
            email: this.data.guarantee.email,
            age: this.data.guarantee.age,
            marital_status: this.data.guarantee.marital_status,

            couple_name: this.data.guarantee.couple_name,
            marriage_place: this.data.guarantee.marriage_place,
            marriage_regime: this.data.guarantee.marriage_regime,

            address: this.data.guarantee.address,
            city: this.data.guarantee.city,
            state: this.data.guarantee.state,
            CP: this.data.guarantee.CP,
            cellphone_number: this.data.guarantee.cellphone_number,

            type_housing_paid: this.data.guarantee.type_housing_paid ? true : false,
            address_paid: this.data.guarantee.address_paid,
            type_housing_paying: this.data.guarantee.type_housing_paying ? true : false,
            address_payment: this.data.guarantee.address_payment,

            mortgage_date: this.data.guarantee.mortgage_date,
            final_comments: this.data.guarantee.final_comments,

            company: this.data.guarantee.company,
            isOwner: this.data.guarantee.isOwner,
            company_address: this.data.guarantee.company_address,
            job: this.data.guarantee.job,
            jefe: this.data.guarantee.immediate_supervisor_name,
            company_phone_number: this.data.guarantee.company_phone_number,
            another_job_industry: this.data.guarantee.another_job_industry,
            monthly_income: this.data.guarantee.monthly_income,
            another_incomes: this.data.guarantee.another_incomes,
            job_seniority: this.data.guarantee.job_seniority,
          });

          this.formStep3.patchValue({
            interes: this.data.interes,
            monto: this.data.monto,
            plazo: this.data.plazo,
            tasa_fmd: this.data.tasa_fmd,
            enganche: this.data.enganche,
            fecha_inicial: this.data.fecha_inicial ? new Date(this.data.fecha_inicial) : null,
            sucursalSeleccionada: this.data.sucursal_id,
            inversionistaSeleccionado: this.data.investor_catalog_id,
          });

          this.servicioGeneral.get('reference', {}, false).subscribe((referencias: any) => {
            const referenciasList = referencias.data;
            const referencia = referenciasList.find((r: any) => r.credit_id === this.idData);

            if (referencia) {
              this.formReferencias.patchValue({
                commercial_name: referencia.commercial_name,
                commercial_phone_number: referencia.commercial_phone_number,
                second_commercial_name: referencia.second_commercial_name,
                second_commercial_phone_number: referencia.second_commercial_phone_number,

                personal_name: referencia.personal_name,
                personal_phone_number: referencia.personal_phone_number,
                personal_cellphone_number: referencia.personal_cellphone_number,
                personal_years_known: referencia.personal_years_known,
                second_personal_name: referencia.second_personal_name,
                second_personal_phone_number: referencia.second_personal_phone_number,
                second_personal_cellphone_number: referencia.second_personal_cellphone_number,
                second_personal_years_known: referencia.second_personal_years_known,

                family_name: referencia.family_name,
                family_phone_number: referencia.family_phone_number,
                family_cellphone_number: referencia.family_cellphone_number,
                family_relationship: referencia.family_relationship,
                second_family_name: referencia.second_family_name,
                second_family_phone_number: referencia.second_family_phone_number,
                second_family_cellphone_number: referencia.second_family_cellphone_number,
                second_family_relationship: referencia.second_family_relationship
              });
            }
          });
          console.log("credito:", credito);

          if (this.data.etapa !== "aprobado") this.cargarDatosFinancieros();
        });
      });

    });

  }

  onConfirmGuarantors(avalData: any): void { //Trabajar con esto
    console.log('avales: ', avalData);
    this.data.customer_guarantee_id = avalData[0].id;
    this.formStep2.patchValue({
      name: avalData[0].name,
      last_name: avalData[0].last_name,
      email: avalData[0].email,

      address: avalData[0].address,
      cellphone_number: avalData[0].cellphone_number,
    })
    this.showGuarantorDialog = false;
  }

  onAddNewGuarantor(): void {
    this.showGuarantorDialog = false;
    this.activeIndex++;
  }

  getImageUrl(vehiculo: any): SafeResourceUrl {
    if (!vehiculo?.fotos_vehiculos?.length) {
      return 'assets/default-car.png';
    }

    const fileName = vehiculo.fotos_vehiculos[0];
    const url = ` https://apiduran.mastergeek.mx/api/files/vehiculos/${vehiculo.id}/${fileName}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  get vehiculosFiltrados(): any[] {
    const texto = this.searchVehiculo?.toLowerCase() || '';
    return this.vehiculos.filter(v =>
      v.brand?.toLowerCase().includes(texto)
    );
  }

  //Prueba de rutas para actualizar etapas en creditos
  onApproveCredit(isApprove: boolean): void {
    const url = this.model + '/approve';
    const etapa = isApprove ? 'aprobado' : 'cotizacion';
    const stageData = { 'etapa': etapa }
    if (this.idData) {
      console.log('Entra al credito aprobado');
      console.log('DatosEtapa: ', stageData);
      console.log('IdEtapa: ', this.idData);
      console.log('Datos completos para ver la etapa:', this.data);
      this.servicioGeneral.update(url, this.idData, stageData, true).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'El crédito fue actualizado correctamente'
          });
        },
        error: (err: any) => {
          console.error('Error al actualizar crédito', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el crédito'
          });
        }
      });
    }
  }

  onAcceptCredit(): void {
    this.dataApprove = {
      etapa: 'aprobacion',
      investor_catalog_id: this.inversionistaSeleccionado ? this.inversionistaSeleccionado.id : 1, // Hardcodeo temporal
      sucursal_id: this.sucursalSeleccionada ? this.sucursalSeleccionada.id : 1,
    }
    this.servicioGeneral.update(this.model, this.data.id, this.dataApprove, true).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'El crédito fue actualizado correctamente'
        });
      },
      error: (err: any) => {
        console.error('Error al actualizar crédito', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el crédito'
        });
      }
    });
  }

  onCancelCredit(): void {
    const ruta = this.model + '/cancel';
    this.data.observacion = 'Esta es una observacion de prueba para el cancelado';
    this.servicioGeneral.update(ruta, this.data.id, this.data, true).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'El crédito fue actualizado correctamente'
        });
      },
      error: (err: any) => {
        console.error('Error al actualizar crédito', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el crédito'
        });
      }
    });
  }

  get tieneDependientes(): boolean {
    return this.form.get('dependientesEconomicos')?.value === 'si';
  }

  goToNextTab() {
    if (this.activeIndex < 5) {
      this.activeIndex++;
    }
  }

  goToPreviousTab() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  onTabChange(event: any) {
    if (event.index !== this.activeIndex) {
      setTimeout(() => {
        this.activeIndex = this.activeIndex;
      });
    }
  }

  updateClient(clientId: any) {
    console.log('Actualizando cliente con datos:', this.form.value);
    this.servicioGeneral.update('customers', clientId, this.form.value).subscribe({
      next: (data: any) => {
        return data;
      }
    });
  }

  updateAval(avalId: any) {
    console.log('Actualizando aval con datos: ', this.formStep2.value);
    this.servicioGeneral.update('customer_guarantee', avalId, this.formStep2.value).subscribe({
      next: (data: any) => {
        return data;
      }
    })
  }
}