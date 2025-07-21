import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['./'] }]
            },
            {
                label: 'Funciones',
                items: [
                    { label: 'pagos extraordinarios', icon: 'pi pi-compass', routerLink: ['./pagos-extraordinarios'] },
                    { label: 'Caja', icon: 'pi pi-shopping-cart', routerLink: ['./caja'] },
                    { label: 'Clientes', icon: 'pi pi-users', routerLink: ['./clientes/lista'] },
                    { label: 'Credito', icon: 'pi pi-credit-card', routerLink: ['./credito'] },
                    { label: 'Historial de actividades', icon: 'pi pi-history', routerLink: ['./historial'] },
                    { label: 'Historial de cartera', icon: 'pi pi-wallet', routerLink: ['./cartera'] },
                    { label: 'Inversionistas', icon: 'pi pi-building', routerLink: ['./ver-inversionistas'] },
                    { label: 'Bancos', icon: 'pi pi-money-bill', routerLink: ['./bancos'] },
                    {
                        label: 'Catalogos', icon: 'pi pi-book', routerLink: ['./catalogos'],
                        items: [
                            //{ label: 'Sucursales', icon: 'pi pi-home', routerLink: ['./catalogos/sucursales/lista'] },
                            { label: 'Vehiculos', icon: 'pi pi-car', routerLink: ['./catalogos/vehiculos/lista'] },
                            { label: 'Inversionistas', icon: 'pi pi-building-columns', routerLink: ['./catalogos/inversionistas/lista'] }
                        ]
                    },
                    {
                        label: 'Configuraciones', icon: 'pi pi-cog',
                        items: [
                            { label: 'Usuarios', icon: 'pi pi-user', routerLink: ['./configuracion/usuarios/lista'] },
                        ]
                    },
                    { label: 'Pagos', icon: 'pi pi-compass', routerLink: ['./pagos'] }
                ]
            }
        ];
    }
}
