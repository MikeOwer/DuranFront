import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from "primeng/inputtext";
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { DatarealtimeService } from "../../../../layout/service/datarealtime.service";
import { SelectModule } from "primeng/select";
import { PasswordModule } from "primeng/password";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.scss"],
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
    PasswordModule
  ],
  providers: [
    MessageService
  ]
})

export class UsuarioComponent implements OnInit {

  titulo: string = 'Usuario';
  texto: string = 'usuario';
  inputGroupValue: any;
  model: any = 'usuarios';
  idData?: number = undefined;
  form!: FormGroup;
  data: any = {};
  pass: string = '';
  estatus: any[] = [
    { name: "Activo", value: true },
    { name: "Suspendido", value: false }
  ];
  private subs: Subscription[] = [];
  urlPage: string = './dashboard/configuracion/usuarios/lista';

  constructor(
    private router: ActivatedRoute,
    private routerBack: Router,
    private fb: FormBuilder,
    private servicio: DatarealtimeService,
    private messageService: MessageService
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      disabled: new FormControl(''),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
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
    this.subs.push(
      this.servicio.getRecord(this.model, this.idData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.data = data;
        },
        error: (err: any) => {
          console.error('Error al cargar', err);
        }
      })
    );
  }

  submitData() {
    if (!this.pass) {
      delete this.data.password;
    } else {
      this.data.password = this.pass;
      this.data.passwordConfirm = this.pass;
    }
    if (this.idData) {
      this.servicio.updateRecord(this.model, this.idData, this.data).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'El usuario fue actualizado correctamente'
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
    } else {
      this.servicio.createRecord(this.model, this.data).subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'El usuario fue guardado correctamente'
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
  }
}
