import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable , from } from "rxjs";
import { switchMap } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ServicioGeneralService {

    private apiURL = environment.APIEndpoint

    constructor(
        private http: HttpClient,
        private router: Router
    ){}

    public async obtenerToken(): Promise<string>{
        const data = await localStorage.getItem('auth_token');
        
        if(!data){
            throw new Error('No se encontró usuario');
        }
        return data;
    }

    private async createHeaders(): Promise<HttpHeaders>{
        const token = await this.obtenerToken();
        return new HttpHeaders({
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json',

        });
    }

    get(url: string, params?: {[key: string]: any}, useHeaders: boolean = true): Observable<any> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (Array.isArray(value)) {
                    value.forEach(val => httpParams = httpParams.append(key, val));
                } else {
                    httpParams = httpParams.set(key, value);
                }
            });
        }

        if (!useHeaders) {
            return this.http.get(`${this.apiURL}/${url}`, { params: httpParams });
        }

        return from(this.createHeaders()).pipe(
            switchMap(headers => {
                return this.http.get(`${this.apiURL}/${url}`, { headers, params: httpParams });
            })
        );
    }

    post(url: string, body: any, useHeaders: boolean = true): Observable<any> {
        if (!useHeaders) {
            return this.http.post(`${this.apiURL}/${url}`, body);
        }

        return from(this.createHeaders()).pipe(
            switchMap(headers => {
                return this.http.post(`${this.apiURL}/${url}`, body, { headers });
            })
        );
    }

    update(url: string, id: number, body: any, useHeaders: boolean = true): Observable<any> {
        if (!useHeaders) {
            return this.http.put(`${this.apiURL}/${url}`, body);
        }

        return from(this.createHeaders()).pipe(
            switchMap(headers => {
                return this.http.put(`${this.apiURL}/${url}/${id}`, body, { headers });
            })
        );
    }

    delete(url: string, id: number, useHeaders: boolean = true): Observable<any>{
        if (!useHeaders) {
            return this.http.delete(`${this.apiURL}/${url}/${id}`);
        }

        return from(this.createHeaders()).pipe(
            switchMap(headers => {
                return this.http.delete(`${this.apiURL}/${url}/${id}`, { headers });
            })
        );
    }
}