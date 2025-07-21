import { Routes } from '@angular/router';
import { CarteraComponent } from './cartera.component';
export default [

    { path: '', component: CarteraComponent},
    { path: '**', redirectTo: '/notfound' }

] as Routes;