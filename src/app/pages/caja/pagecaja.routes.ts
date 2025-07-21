import {Routes} from '@angular/router';
import { CajaComponent } from './caja.component';
import { ListaComponent } from './lista/lista.component';
export default[
    {path: 'detalles/:id', component: ListaComponent},
    {path: '', component: CajaComponent}
] as Routes;