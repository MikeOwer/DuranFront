import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {


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

    const channel = pusher.subscribe('stages');
    console.log('Canal: ',channel);

    channel.bind('CreditStages', (data: any) => {
      console.log('Evento WebSocket:', data);

      const message = data.message;
      const action = data.action;

      const title = action === 'aprobado' ? 'Un credito ha sido aprobado' : `Se realizo una ${action}`;

      this.messageService.add({
        severity: 'info',
        summary: message,
        detail: title,
        life: 4000
      });
    });
    } catch (error){
      console.error(' Error al inicializar Pusher:', error);
    }
    
  }
}