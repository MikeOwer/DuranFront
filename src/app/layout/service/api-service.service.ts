import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ServicioGeneralService } from './servicio-general/servicio-general.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient, private generalService: ServicioGeneralService) {}

  

  getMe() {
    const token = localStorage.getItem('auth_token');
    console.log('token:',token);
    const headers = {
      Authorization: `Bearer ${token}`
    }; 

    //return this.generalService.get('me', {}, true); 

     return this.http.get('http://localhost:80/api/me', { responseType: 'json' });
  }

}
