import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ServicioGeneralService } from '../../../layout/service/servicio-general/servicio-general.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-bolsa',
  imports: [CommonModule, TableModule, ConfirmDialogModule, ButtonModule, ToolbarModule, FormsModule, ReactiveFormsModule, InputGroupModule, InputTextModule, InputGroupAddonModule, ToastModule, DialogModule],
  providers: [MessageService],
  templateUrl: './bolsa.component.html',
  styleUrl: './bolsa.component.scss'
})
export class BolsaComponent implements OnInit {
  titulo: string = 'Bolsa';
  @ViewChild('dt') table!: Table;
  globalFilter: string = '';
  data: any[] = [];
  inversionistaId: any = '';
  billing: any[] = [];
  investments: any[] = [];
  withdrawals: any[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: ServicioGeneralService,
  ) { }

  ngOnInit(): void {
    this.inversionistaId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.get(`cash_closing_table/${this.inversionistaId}`, {}, true).subscribe((data) => {
      this.data = data;
      console.log("inversionista data", this.data);
      /* console.log("this data", this.data)
      this.billing = data.data.billing[0];
      console.log('billing:',this.billing[0])
      this.investments = data.data.investments;
      console.log(this.investments)
      this.withdrawals = data.data.withdrawals; */
      this.billing = Array.isArray(data.data.billing) ? data.data.billing : [data.data.billing];
      this.investments = Array.isArray(data.data.investments) ? data.data.investments : [data.data.investments];
      this.withdrawals = Array.isArray(data.data.withdrawals) ? data.data.withdrawals : [data.data.withdrawals];
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
  getTotal(campo: 'total_cobrado' | 'capital_cobrado' | 'interes_cobrado' | 'IVA'): number {
    return this.billing.reduce((acc, item) => acc + (item[campo] || 0), 0);
  }

  getTotalInvestments(campo: 'cantidad'): number {
    return this.investments.reduce((acc, item) => acc + (item[campo] || 0), 0);
  }

  getTotalWithdrawals(campo: 'cantidad'): number {
    return this.withdrawals.reduce((acc, item) => acc + (item[campo] || 0), 0);
  }
  goBack() {
    this.location.back();
  }
}
