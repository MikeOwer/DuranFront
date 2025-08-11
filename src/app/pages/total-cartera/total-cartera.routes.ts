import { Routes } from '@angular/router';
import { TotalCarteraComponent } from './total-cartera.component';
export default [

    { path: '', component: TotalCarteraComponent},
    { path: '**', redirectTo: '/notfound' }

] as Routes;