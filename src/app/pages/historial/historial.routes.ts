import { Routes } from '@angular/router';
import { HistorialComponent } from './historial.component'; 

export default [
    { path: '', component: HistorialComponent},
    { path: '**', redirectTo: '/notfound' }

] as Routes;
