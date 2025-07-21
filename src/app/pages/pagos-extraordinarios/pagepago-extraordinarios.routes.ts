import { Routes } from '@angular/router';
import { PagosExtraordinariosComponent } from './pagos-extraordinarios.component';

export default [
    { path: '', component: PagosExtraordinariosComponent},
    { path: '**', redirectTo: '/notfound' }

] as Routes;
