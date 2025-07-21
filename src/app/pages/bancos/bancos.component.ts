import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';
import { MessageService } from "primeng/api";
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bancos',
  imports: [CommonModule, ToolbarModule, FormsModule, TableModule, ConfirmDialogModule, ToastModule, DropdownModule, ButtonModule, RouterModule],
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss'],
  providers: [MessageService],
})
export class BancosComponent implements OnInit {
  data: any[] = [];
  messageService!: MessageService;
  titulo = 'Bancos';
  @ViewChild('dt') table!: Table;
  globalFilter: string = '';
  bancos:any [] = [];

  bancoSeleccionado: any = null;
  constructor(
    private serviciogeneral: ServicioGeneralService
  ) { }

  ngOnInit(): void {
    this.serviciogeneral.get('bank', {}, false).subscribe({
      next: (data) => {
        this.bancos = data.data;
        console.log(this.bancos);

      }
    })
  }

  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }

  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(inputValue, 'contains');
  }

  onBancoChange(event: any) {
    if(this.bancoSeleccionado == null){
      this.data = [];
      return;
    }
    this.cargarDatos();
  }
  
  cargarDatos() {
    console.log('banco:',this.bancoSeleccionado)
    this.serviciogeneral.post(`bank_table/${this.bancoSeleccionado.id}`, {"account_number":this.bancoSeleccionado.account_number}, false).subscribe({
      next: (data) => {
        const transacciones = data.data.transactions;
        console.log(transacciones);
        this.data = transacciones;
        
      }
    })
  }

}
