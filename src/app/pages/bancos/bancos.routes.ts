import { Routes } from '@angular/router';
import { BancosComponent } from './bancos.component';
import { CrearBancoComponent } from './crear-banco/crear-banco.component';
import { CrearTransaccionComponent } from './crear-transaccion/crear-transaccion.component';
export default [

    { path: '', component: BancosComponent},
    { path: 'crear', component: CrearBancoComponent}, // Ruta temporal para crear bancos
    { path: 'transaccion', component: CrearTransaccionComponent},
    { path: '**', redirectTo: '/notfound' },
    

] as Routes;