import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
    constructor(private messageService: MessageService) {
        this.initPusher();
    }

    private initPusher() {
        try{
            const pusher = new Pusher('local', {
            wsHost: 'localhost',
            wsPort: 8080,
            forceTLS: false,
            disableStats: true,
            enabledTransports: ['ws'],
            cluster: 'mt1'
        });

        const channel = pusher.subscribe('notifications');
        console.log('Canal: ',channel);

        channel.bind('Notifications', (data: any) => {
            console.log('Evento WebSocket:', data);

            const description = data.notifications['description'];
            const user = data.notifications['user']
            const action = data.action;

            this.messageService.add({
            severity: 'info',
            summary: description,
            detail: user,
            life: 4000
            });
        });
        } catch (error){
            console.error(' Error al inicializar Pusher:', error);
        }
    
    }
}
