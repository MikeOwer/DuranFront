import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ServicioGeneralService } from '../../../layout/service/servicio-general/servicio-general.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GeneralWebsocketService } from '../../../layout/service/general-websocket.service';
import { TabsModule } from 'primeng/tabs';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
//import { InputGroupModule } from 'primeng/inputgroup';


@Component({
  selector: 'app-crear-banco',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ButtonModule, TabsModule, InputGroup, InputGroupAddon, InputGroup, InputTextModule],
  templateUrl: './crear-banco.component.html',
  styleUrl: './crear-banco.component.scss',
  providers: [MessageService],
  standalone: true
})

export class CrearBancoComponent {
  messageService!: MessageService;
  form!: FormGroup;
  data: any = {};
  bancoChannelName: string = 'bank';

  constructor(private fb: FormBuilder, private serviciogeneral: ServicioGeneralService, private router: Router, private location: Location, private generalSocketService: GeneralWebsocketService) { }

  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      account_name: ['', Validators.required],
      account_last_name: ['', Validators.required],
      account_number: ['', Validators.required],
      balance: ['', Validators.required]
    });
  }

  onSubmit() {
    this.data = {
      name: this.form.value.name,
      account_name: this.form.value.account_name,
      account_last_name: this.form.value.account_last_name,
      account_number: this.form.value.account_number,
      balance: this.form.value.balance,
      cash_closing_date: '2023-10-01'
    }

    this.serviciogeneral.post('bank', this.data, false).subscribe({
      next: (data) => {
        /* this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'El banco fue creado correctamente'
        }); */
        this.router.navigate(['/bancos']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el banco'
        });
      }
    })
  }

  goBack() {
    this.location.back();
  }
}
