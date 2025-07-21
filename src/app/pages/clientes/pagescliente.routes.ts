import { Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { VerVehiculosComponent } from './ver-vehiculos/ver-vehiculos.component';
import { VerPagosComponent } from './ver-pagos/ver-pagos.component';
import { VerObservacionesComponent } from './ver-observaciones/ver-observaciones.component';

export default [
    { path: 'nuevo', component: ClienteComponent },
    { path: 'editar/:id', component: ClienteComponent },
    { path: 'vehiculo/:id', component: VerVehiculosComponent},
    { path: 'pagos/:id', component: VerPagosComponent},
    { path: 'observaciones/:id',component: VerObservacionesComponent},
    { path: 'lista', component: ListaClientesComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
