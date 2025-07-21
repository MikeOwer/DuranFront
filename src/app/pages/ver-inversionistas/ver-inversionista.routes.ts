import { Routes } from '@angular/router';
import { VerInversionistasComponent } from './ver-inversionistas.component'; 
import { CatalogoInversionistaComponent } from './catalogo-inversionista/catalogo-inversionista.component';
import { BolsaComponent } from './bolsa/bolsa.component';
export default [
    { path: 'catalogo-inversionista/:id', component: CatalogoInversionistaComponent },
    { path: 'bolsa/:id', component: BolsaComponent },
    { path: '', component: VerInversionistasComponent },
    { path: '**', redirectTo: '/notfound' }

] as Routes;
