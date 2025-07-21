import { CommonModule } from '@angular/common';
import { Component,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DatarealtimeService } from '../../layout/service/datarealtime.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';
@Component({
  selector: 'app-ver-inversionistas',
  imports: [CommonModule, ButtonModule, ToolbarModule, TableModule, InputGroupModule, ConfirmDialogModule, ButtonModule, FormsModule, ToastModule],
  templateUrl: './ver-inversionistas.component.html',
  styleUrl: './ver-inversionistas.component.scss'
})
export class VerInversionistasComponent implements OnInit {
  data: any []= [];
  titulo: string = 'Inversionistas';
  @ViewChild('dt') table!: Table;
  globalFilter: string = '';
  creditosTotal: number = 0;
  urlPage: string = './dashboard/ver-inversionistas/';
  constructor(private realtimeService: DatarealtimeService, private router: Router, private servicio: ServicioGeneralService){}

  ngOnInit() {
   /* this.realtimeService.listenToCollectionExpand('catalogo_inversionistas', 'id_creditos').subscribe((data) => {
    this.data = data;
    let totalMontos = 0;

    this.data.forEach((inversionista: any) => {
      if (inversionista.id_creditos && Array.isArray(inversionista.expand.id_creditos)) {
        inversionista.expand.id_creditos.forEach((credito: any) => {
          totalMontos += Number(credito.monto || 0);
        });
      }
    });
    this.creditosTotal = totalMontos;
    console.log(this.data);
    });*/

    this.servicio.get('investor_catalog', {}, true).subscribe((data) =>{
      this.data = data.data;
      console.log(this.data)
      let totalMontos = 0;
    });
  }

  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }

  link(id: any = undefined, option: number = 0) {
    console.log(id);
    if (id && option == 1) {
      this.router.navigate([this.urlPage + 'catalogo-inversionista/' + id]);
      
    }else if (id && option == 2) {
      this.router.navigate([this.urlPage + 'bolsa/' + id]);
    } else {
      this.router.navigate([this.urlPage]);
    }
  }

  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    // "dt" es tu referencia a la tabla p-table (o DataTable)
    this.table.filterGlobal(inputValue, 'contains');
  }

  
}
