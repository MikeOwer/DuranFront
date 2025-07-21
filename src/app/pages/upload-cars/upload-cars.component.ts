import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepsModule } from 'primeng/steps';
import { TabsModule } from 'primeng/tabs';
import { TabViewModule } from 'primeng/tabview';
import { DatarealtimeService } from '../../layout/service/datarealtime.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { ChangeDetectorRef } from '@angular/core';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';
import { Subscription } from "rxjs";
import { GeneralWebsocketService } from '../../layout/service/general-websocket.service';
@Component({
  selector: 'app-upload-cars',
  imports: [CommonModule, FileUploadModule, StepsModule, CardModule, FormsModule, InputGroupModule, DropdownModule, SelectModule, InputTextModule, ButtonModule, InputGroupAddon, ReactiveFormsModule, SelectButtonModule, TabsModule, TabViewModule],
  templateUrl: './upload-cars.component.html',
  styleUrl: './upload-cars.component.scss'
})
export class UploadCarsComponent {
  uploadedFiles: any[] = [

  ];
  activeIndex: number = 0;
  items: any[] = [
    { label: 'Datos' },
    { label: 'Imagenes' }
  ];
  titulo: string = 'Vehiculo';
  texto: string = 'vehiculo';
  model: any = 'vehicles';
  idData?: number = undefined;
  carForm!: FormGroup;
  vehiculoChannelName: string = 'vehicle';
  data: any = {
    brand: '',
    model: '',
    year: '',
    vin: '',
    numero_duenos: '',
    nombre_ultimo_duenio: '',
    origen: '',
    disabled: ''
  };
  prueba: boolean = false;
  estatus: any[] = [
    { name: "Activo", value: 0 },
    { name: "Suspendido", value: 1 }
  ];
  duenios = [
  { name: "1 dueño", value: "1" },
  { name: "2 dueños", value: "2" },
  { name: "3 dueños", value: "3" },
  { name: "4 dueños", value: "4" },
  { name: "5 dueños", value: "5" },
]
  private subs: Subscription[] = [];
  constructor(private fb: FormBuilder, private realtimeService: DatarealtimeService, private router: Router, private cdr: ChangeDetectorRef, private servicioGeneral: ServicioGeneralService, private activeRouter: ActivatedRoute, private generalSocketService: GeneralWebsocketService) { }

  ngOnInit(): void {
    this.generalSocketService.initPusher(this.vehiculoChannelName);
    
    this.carForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      color: ['', Validators.required],
      precio_sugerido: ['',Validators.required],
      disabled: [false],
      km: ['', Validators.required],
      precio: ['', Validators.required],
      numero_motor: ['', Validators.required],
      numero_serie: ['', Validators.required],
      placas: ['', Validators.required]
    });
    this.subs.push(this.activeRouter.params.subscribe(
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
  onSelect(event: any) {
    for (let file of event.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedFiles.push({
          ...file,
          objectURL: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onRemove(event: any) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== event.file.name);
  }


  onFilesSelected(event: any) {
    this.uploadedFiles = [...this.uploadedFiles, ...event.files];
  }
  onClearFiles() {
    this.uploadedFiles = [];
  }

  uploadFiles(event: any) {
    const archivosSeleccionados: File[] = event.files;
    console.log('Subiendo archivos:', archivosSeleccionados);

    this.realtimeService.uploadConFoto('vehiculos', 'fotos_vehiculos', this.data, archivosSeleccionados)
      .subscribe({
        next: res => {
          console.log('Subido exitosamente', res);
          this.activeIndex++;
        },
        error: err => console.error('Error al subir', err)
      });
  }

  @ViewChild('fileUpload') fileUpload!: FileUpload;


  removeUploadedFile(index: number) {
    this.fileUpload.files.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
  }

  removeUploadedFileCallback = (index: number) => {
    this.removeUploadedFile(index);
  }

  onFileRemoved(event: any) {
    const removedFile: File = event.file;

    const index = this.uploadedFiles.findIndex(file =>
      file.name === removedFile.name && file.size === removedFile.size
    );

    if (index !== -1) {
      this.removeUploadedFileCallback(index);
    }
  }

  cargarDatos() {
    this.servicioGeneral.get('vehicles', {}, false).subscribe({
      next: (data: any) => {
        console.log(this.idData);
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

  BotonSiguiente() {

    this.data = {
      brand: this.carForm.value.marca,
      model: this.carForm.value.modelo,
      year: this.carForm.value.anio,
      serial_number: this.carForm.value.numero_serie,
      km: this.carForm.value.km,
      engine_number: this.carForm.value.numero_motor,
      list_price: this.carForm.value.precio,
      color: this.carForm.value.color,
      car_plate: this.carForm.value.placas
    }
    console.log(this.data)
    this.servicioGeneral.post(this.model, this.data, true).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
      },
      error: (err) => {
        console.error('Error al enviar datos:', err);
      }
    })

    this.router.navigate(['./dashboard/catalogos/vehiculos/lista']);
  }
}
