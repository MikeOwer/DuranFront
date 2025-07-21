import { Injectable, model } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class GeneralWebsocketService {

  constructor(private messageService: MessageService) {
  }

  private channels: Record<string, Channel> = {};

  public initPusher(chName: string) {

    if (this.channels[chName]) {
      // Ya está inicializado
      return;
    }
    try{
      const pusher = new Pusher('local', {
      wsHost: 'localhost',
      wsPort: 8080,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws'],
      cluster: 'mt1'
    });

    const channel = pusher.subscribe(chName+'-channel');
    this.channels[chName] = channel;
    console.log('Canal: ',channel);

    channel.bind('TableUpdated', (data: any) => {
      console.log('Evento WebSocket:', data);

      const actionVerbs = {
        created: 'cread',
        updated: 'editad',
        deleted: 'eliminad'
      };

      const modelData = data.data;
      const action = data.action as 'created' | 'updated' | 'deleted';
      const isWithA = chName === 'sucursal';
      const article = isWithA ? 'Una ' : 'Un ';
      const finalVowel = isWithA ? 'a' : 'o';
      

      const verb = actionVerbs[action];
      if (!verb) return;

      var message = `${article} ${chName} ha sido ${verb}${finalVowel}`;
      var title = `${modelData.display_name ?? 'Elemento'} ${verb}${finalVowel}`;

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

  public onEvent(
    chName: string,
    callback: (data: any) => void
  ): void {
    const channel = this.channels[chName];
    if (!channel) {
      console.warn('Canal no inicializado aún:', chName);
      return;
    }

    //channel.unbind('TableUpdated');
    channel.bind('TableUpdated', callback);
  }

  public offEvent(chName: string) {
  const channel = this.channels[chName];
  if (channel) {
    channel.unbind('TableUpdated');
  }
}
}