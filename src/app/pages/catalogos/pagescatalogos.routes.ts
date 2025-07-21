import { Routes } from '@angular/router';
import { ListaSucursalesComponent } from './sucursales/lista-sucursales/lista-sucursales.component';
import { SucursalComponent } from './sucursales/sucursal/sucursal.component';
import { ListaVehiculosComponent } from './vehiculos/lista-vehiculos/lista-vehiculos.component';
import { VehiculoComponent } from './vehiculos/vehiculo/vehiculo.component';
import { ListaInversionistasComponent } from './inversionistas/lista-inversionistas/lista-inversionistas.component';
import { InversionistaComponent } from './inversionistas/inversionista/inversionista.component';
import { UploadCarsComponent } from '../upload-cars/upload-cars.component';

export default [
    { path: 'sucursales/lista', component: ListaSucursalesComponent },
    { path: 'sucursales/nuevo', component: SucursalComponent },
    { path: 'sucursales/editar/:id', component: SucursalComponent },
    { path: 'vehiculos/lista', component: ListaVehiculosComponent },
    { path: 'vehiculos/nuevo', component: UploadCarsComponent },
    { path: 'vehiculos/editar/:id', component: UploadCarsComponent },
    { path: 'inversionistas/lista', component: ListaInversionistasComponent },
    { path: 'inversionistas/nuevo', component: InversionistaComponent },
    { path: 'inversionistas/editar/:id', component: InversionistaComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
