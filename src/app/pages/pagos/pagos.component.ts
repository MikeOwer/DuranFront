import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service'; // Ajusta la ruta si es necesario
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { GeneralWebsocketService } from '../../layout/service/general-websocket.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, ButtonModule],
})
export class PagosComponent implements OnInit {

  data: any = {};
  form!: FormGroup;
  urlPage: string = './dashboard/catalogos/inversionistas/lista';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private servicio: ServicioGeneralService,
    private messageService: MessageService,
    private generalSocketService: GeneralWebsocketService
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      monto: new FormControl('', [Validators.required]),
      concepto: new FormControl('', [Validators.required])
    });
  }

  onBack(): void {
    this.router.navigate([this.urlPage]);
  }

  submitPago(): void {
    const monto = this.form.value.monto;
    this.data = {
      monto: monto,
      tipo_pago: 0,
      pendiente: 0,
      sucursal_id: 1,
      customer_id: 1
    }
    this.servicio.post('pago_realizado', this.data).subscribe({ //Afinar esto
      next: (res: any) => {
        const concepto_data = {
          pagos_realizados_id: res.data.id,
          concepto: this.form.value.concepto,
          monto: monto
        };
        this.servicio.post('concepto_pago', concepto_data).subscribe({
          next: (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Pago aplicado',
              detail: 'El concepto fue procesado correctamente.'
            });
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo aplicar el concepto.'
            });
            console.error(err);
          }
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Pago aplicado',
          detail: 'El pago fue procesado correctamente.'
        });
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo aplicar el pago.'
        });
        console.error(err);
      }
    });

    this.router.navigate(['./dashboard']);
  }
}