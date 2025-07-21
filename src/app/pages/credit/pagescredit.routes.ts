import { Routes } from '@angular/router';
import { EditcreditComponent } from './editcredit/editcredit.component';
import { CreditComponent } from './credit.component';
import { UploadCarsComponent } from '../upload-cars/upload-cars.component';
export default [
    { path: 'nuevo', component: EditcreditComponent },
    { path: 'cotizar', component: EditcreditComponent },
    { path: 'editar/:id', component: EditcreditComponent },
    { path: 'prueba', component:UploadCarsComponent},
    { path: '', component: CreditComponent},
    { path: '**', redirectTo: '/notfound' }

] as Routes;
