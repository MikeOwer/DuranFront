import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/layout/guard/auth.guard';

export const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'clientes', loadChildren: () => import('./app/pages/clientes/pagescliente.routes') },
            { path: 'configuracion', loadChildren: () => import('./app/pages/configuracion/pagesconfigiracion.routes') },
            { path: 'catalogos', loadChildren: () => import('./app/pages/catalogos/pagescatalogos.routes') },
            { path: 'credito', loadChildren:()=> import('./app/pages/credit/pagescredit.routes')},
            { path: 'caja', loadChildren:()=> import('./app/pages/caja/pagecaja.routes')},
            { path: 'pagos-extraordinarios', loadChildren:()=> import('./app/pages/pagos-extraordinarios/pagepago-extraordinarios.routes')},
            { path: 'historial', loadChildren:()=> import('./app/pages/historial/historial.routes')},
            { path: 'cartera', loadChildren:()=> import('./app/pages/cartera/cartera.routes')},
            { path: 'total-cartera', loadChildren: () => import('./app/pages/total-cartera/total-cartera.routes') },
            { path: 'ver-inversionistas', loadChildren: () => import('./app/pages/ver-inversionistas/ver-inversionista.routes') },
            { path: 'bancos', loadChildren: () => import('./app/pages/bancos/bancos.routes') },
            { path: 'pagos', loadChildren: () => import('./app/pages/pagos/pagos.routes') },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/auth/login' },
];
