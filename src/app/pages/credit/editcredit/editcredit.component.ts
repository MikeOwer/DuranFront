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
    CheckboxModule


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
    this.form = this.fb.group({
      nombre: new FormControl('', Validators.required),
      direction: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      correo: new FormControl('', Validators.required),
      celular: new FormControl('', Validators.required),
    });

    this.formStep2 = this.fb.group({
      nombreGuarantor: new FormControl('', Validators.required),
      directionGuarantor: new FormControl('', Validators.required),
      telefonoGuarantor: new FormControl('', Validators.required),
      correoGuarantor: new FormControl('', Validators.required),
      celularGuarantor: new FormControl('', Validators.required)
    });

    this.formStep3 = this.fb.group({
      interes: new FormControl('', Validators.required),
      plazo: new FormControl('', Validators.required),
      iva: new FormControl(false, Validators.required),
      enganche: new FormControl('', Validators.required),
      tasa_fmd: new FormControl('', Validators.required),
      fecha_inicial: new FormControl('', Validators.required),
      sucursalSeleccionada: new FormControl('1', Validators.required),
      inversionistaSeleccionado: new FormControl('1', Validators.required),
    });

    this.formMarca = this.fb.group({
      marca: new FormControl('', Validators.required),
      modelo: new FormControl('', Validators.required),
      anio: new FormControl('', Validators.required),
      monto: new FormControl('', Validators.required),
    });

  }

  nextStep(): void {

    if (this.activeIndex === 0 && this.clienteid) {
      try {
        this.servicio.listenToCollection('aval_cliente').subscribe(avales => {
          this.possibleGuarantors = avales.filter((aval: any) => aval.idRel_cliente === this.clienteid);
        });

      } catch (err) {
        console.error('Error al buscar avales');
      }


      this.showGuarantorDialog = true;
    } else if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    }
  }


  prevStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  async submitForm(): Promise<void> {
    console.log(this.form.value);
    console.log(this.formStep2.value);
    console.log(this.formStep3.value);
    console.log(this.formMarca.value);
    console.log((this.form.valid && this.formStep2.valid && this.formStep3.valid && this.formMarca.valid));
    console.log(this.form.valid, this.formStep2.valid, this.formStep3.valid, this.formMarca.valid);

    if (this.form.valid && this.formStep2.valid && this.formStep3.valid && this.formMarca.valid) {
      try {
        console.log('Data completa en submitForm de editCreditComponent:', this.data);

        /* // 1. Actualizar cliente
        await this.servicioGeneral.update('customers', this.data.customer_id, {
          nombre: this.form.value.nombre,
          direccion: this.form.value.direction,
          telefono: this.form.value.telefono,
          correo: this.form.value.correo,
          celular: this.form.value.celular,
        }).toPromise();
        

        // 2. Actualizar aval
        await this.servicioGeneral.update('customer_guarantee', this.data.customer_guarantee_id, {
          nombre: this.formStep2.value.nombreGuarantor,
          direccion: this.formStep2.value.directionGuarantor,
          telefono: this.formStep2.value.telefonoGuarantor,
          correo: this.formStep2.value.correoGuarantor,
          celular: this.formStep2.value.celularGuarantor,
        }).toPromise();

        await this.servicioGeneral.update('vehicles', this.data.vehicle_id, {
          nombre: this.formMarca.value.nombreGuarantor,
          direccion: this.formMarca.value.directionGuarantor,
          telefono: this.formMarca.value.telefonoGuarantor,
          correo: this.formMarca.value.correoGuarantor,
          celular: this.formMarca.value.celularGuarantor,
        }).toPromise(); */

        // 3. Actualizar datos de crédito
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

        // 4. Crear o actualizar el crédito
        if (this.idData) {
          console.log('El id en editCreditComponent para probar', this.idData);
          this.data.etapa = 'cotizacion'; // Hardcodeo de nuevo, ver como manejarlo despues
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
        } else {
          this.modo === 'cotizar' ? this.data.etapa = 'cotizacion' : this.data.etapa = 'aprobacion';
          this.data.codigo = 10000;

          const vehiclePrice = { price: this.formMarca.value.monto }
          console.log('VehicleID en credito', this.data.vehicle_id);

          this.servicioGeneral.update('vehicles/price/' + this.data.vehicle_id, this.data.vehicle_id, vehiclePrice, false).subscribe({
            next: (data: any) => {
            },
            error: (err: any) => {
              console.error('Error al setear precio', err);
            }
          })

          console.log('El id en editCreditComponent para probar el post', this.data);
          this.servicioGeneral.post(this.model, this.data, true).subscribe({
            next: (data: any) => {
              console.log('Datos completos: ', data);
              this.messageService.add({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'El crédito fue creado correctamente'
              });
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

    this.routerBack.navigate(['./dashboard/credito']);
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
    console.log('formStep3 onSucursalChange:', this.formStep3.value);
  }

  onInversionistaChange(event: any) {
    this.inversionistaSeleccionado = this.inversionistas.find((i: any) => i.id == event.value);
    this.formStep3.patchValue({
      inversionistaSeleccionado: this.inversionistaSeleccionado,
    });
    console.log('Inversionista seleccionado:', this.inversionistaSeleccionado);
  }

  async seleccionarCliente(cliente: any) {
    this.data.customer_id = cliente.id;

    this.form.patchValue({
      nombre: cliente.name,
      direction: cliente.address,
      telefono: cliente.phone_number,
      correo: cliente.email,
      celular: cliente.cellphone_number,
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
      monto: vehiculo.price
    });
    this.vehiculoid = vehiculo.id;
    this.vehiculoDialog = false;
  }

  async cargarDatos() {
    /*this.subs.push(
      this.servicio.getRecord(this.model, this.idData).subscribe({
        next: async (data: any) =>{
          console.log(data);
          this.data = data;
          try{
            const clienteData = await this.servicio.getRecord('clientes', data.idcliente).toPromise();
            this.data.cliente = clienteData;
            this.form.patchValue({
              nombre: clienteData.nombre,
              direction: clienteData.direccion,
              telefono: clienteData.telefono,
              correo: clienteData.email,
              celular: clienteData.celular,
            });
            console.log(data);
            const avalData = await this.servicio.getRecord('aval_cliente', data.idaval).toPromise();
            console.log(avalData);
            this.data.aval = avalData;
            
            this.formStep2.patchValue({
              nombreGuarantor: avalData.nombre,
              directionGuarantor: avalData.direccion,
              telefonoGuarantor: avalData.telefono,
              correoGuarantor: avalData.email,     
              celularGuarantor: avalData.celular
            })
          }catch{
            console.error('Error cargando cliente o aval')
          }
          this.formStep3.patchValue({
            monto: data.monto,
            plazo: data.plazo,
            tasa: data.tasa,
            enganche: data.enganche
          })

        },
        error: (err: any)=>{
          console.error('Error al cargar', err);
        }
      })
    )*/
    this.servicioGeneral.get(`credito/${this.idData}`, {}, false).subscribe((creditoRes: any) => {
      const credito = creditoRes.data;

      this.servicioGeneral.get('customers', {}, false).subscribe((clientes: any) => {
        const customersList = clientes.data;
        const cliente = customersList.find((c: any) => c.id === credito.customer_id);

        this.servicioGeneral.get('customer_guarantee', {}, false).subscribe((guarantees: any) => {
          const guaranteesList = guarantees.data;
          const guarantee = guaranteesList.find((g: any) => g.id === credito.customer_guarantee_id);

          // Final: Crédito con cliente y garantía anidados
          this.data = {
            ...credito,
            cliente: cliente || null,
            guarantee: guarantee || null
          };

          console.log('datos completos de credito en onInit de edit credit component', this.data);
          this.form.patchValue({
            nombre: this.data.cliente.name,
            direction: this.data.cliente.address,
            telefono: this.data.cliente.phone_number,
            correo: this.data.cliente.email,
            celular: this.data.cliente.cellphone_number,
          });

          this.formStep2.patchValue({
            nombreGuarantor: this.data.guarantee.name,
            directionGuarantor: this.data.guarantee.address,
            telefonoGuarantor: this.data.guarantee.phone_number,
            correoGuarantor: this.data.guarantee.email,
            celularGuarantor: this.data.guarantee.cellphone_number
          });

          this.formStep3.patchValue({
            interes: this.data.interes,
            monto: this.data.monto,
            plazo: this.data.plazo,
            tasa_fmd: this.data.tasa_fmd,
            enganche: this.data.enganche,
            fecha_inicial: this.data.fecha_inicial,
            sucursalSeleccionada: this.data.sucursal_id,
            inversionistaSeleccionado: this.data.investor_catalog_id,
          });
        });
      });

    });

  }

  onConfirmGuarantors(avalData: any): void { //Trabajar con esto
    console.log('avales: ', avalData);
    this.data.customer_guarantee_id = avalData[0].id;
    this.formStep2.patchValue({
      nombreGuarantor: avalData[0].name,
      directionGuarantor: avalData[0].address,
      telefonoGuarantor: avalData[0].phone_number,
      correoGuarantor: avalData[0].email,
      celularGuarantor: avalData[0].cellphone_number
    })
    this.showGuarantorDialog = false;
    this.activeIndex++;
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
}