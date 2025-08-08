import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebsocketService } from './app/layout/service/web-socket.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { GeneralWebsocketService } from './app/layout/service/general-websocket.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/layout/interceptors/auth.interceptor';
import { ApiServiceService } from './app/layout/service/api-service.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, CommonModule, ToastModule],
    providers: [
        MessageService,
        WebsocketService,
        GeneralWebsocketService,
        {
            provide: HTTP_INTERCEPTORS,
            useValue: AuthInterceptor,
            multi: true
        }
    ],
    template: `<router-outlet></router-outlet><p-toast></p-toast>`
})


export class AppComponent {

    constructor(private wsService: WebsocketService, private generalSocketService: GeneralWebsocketService, private apiService: ApiServiceService, private router: Router) {
        console.log('AppComponent inicializado ✅', wsService);
        this.generalSocketService.initPusher('sucursal');
        this.generalSocketService.initPusher('customer');
        this.generalSocketService.initPusher('vehicle');
        this.generalSocketService.initPusher('bank');
        this.generalSocketService.initPusher('customer-guarantee');
        this.generalSocketService.initPusher('pagos-realizados');
        this.generalSocketService.initPusher('investor-catalog');
        this.generalSocketService.initPusher('credito');
        this.generalSocketService.initPusher('investor-withdrawals');

    }

    ngOnInit() {
        this.apiService.getMe().subscribe({
            next: (res: any) => {
                console.log('Usuario cargado: ', res.user);
            },
            error: (err) => {
                console.log('No autenticado, se redirige por interceptor');
                console.log('Error:', err);
                this.router.navigate(['./auth/login']);
            }
        });
    }

}
