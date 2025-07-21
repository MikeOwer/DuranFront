import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule, Table } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';

import { DatarealtimeService } from '../../layout/service/datarealtime.service';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ServicioGeneralService } from '../../layout/service/servicio-general/servicio-general.service';

@Component({
  selector: 'app-pagos-extraordinarios',
  imports: [CommonModule, ToolbarModule, TableModule, TabViewModule, InputGroupModule, FormsModule, ConfirmDialogModule, ToastModule, ButtonModule],
  templateUrl: './pagos-extraordinarios.component.html',
  styleUrl: './pagos-extraordinarios.component.scss'
})
export class PagosExtraordinariosComponent implements OnInit {
  titulo: string = "Pagos extraordinarios";
  @ViewChild('dt') table!: Table;
  globalFilter: string = '';
  data: any[] = [];
  model: any = 'pagos_extraordinarios';
  constructor(private realtimeService: DatarealtimeService, private servicio: ServicioGeneralService){}

  ngOnInit(): void {
    /*this.realtimeService.listenToCollection(this.model).subscribe(data => {
      this.data = data;
      console.log(data);
      
    });*/

    this.servicio.get('pagos_extraordinarios', {}, true).subscribe(data => {
      this.data = data.data;
      console.log(this.data);
    })
  }
  
  clearFilters() {
    this.table.clear();
    this.globalFilter = '';
  }

  onFilterGlobal(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    // "dt" es tu referencia a la tabla p-table (o DataTable)
    this.table.filterGlobal(inputValue, 'contains');
  }
}
