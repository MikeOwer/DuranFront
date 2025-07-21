import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { environment } from "../../../environments/environment.prod";
import PocketBase from 'pocketbase';
import { HttpClient } from '@angular/common/http';

/**
 * @description
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class DatarealtimeService {
  private pb = new PocketBase(environment.APIEndpoint);
  private dataSubjects: { [key: string]: BehaviorSubject<any[]> } = {};

  constructor(private http: HttpClient) { }
  
  login(email: string, password: string): Observable<any> {
    return from(this.pb.collection('usuarios').authWithPassword(email, password));
  }
  
  listenToCollection(collection: string) {
    if (!this.dataSubjects[collection]) {
      this.dataSubjects[collection] = new BehaviorSubject<any[]>([]);
      this.init(collection);
    }
    return this.dataSubjects[collection].asObservable();
  }
  
  listenToCollectionExpand(collection: string, expandFields: string = '') {
  return new Observable<any[]>(observer => {
    const loadData = async () => {
      try {
        const records = await this.pb.collection(collection).getFullList({
          expand: expandFields
        });
        observer.next(records);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    loadData();
    this.pb.collection(collection).subscribe('*', () => {
      console.log('Cambio detectado, recargando...');
      loadData();
    });
  });
}

uploadConFoto(collection: string, appendData: string, data: any, files: File[]) {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  files.forEach(file => formData.append(appendData, file, file.name));

  return from(this.pb.collection(collection).create(formData));
}

getRecordsWhere(collection: string, field: string, value: string): Observable<any[]> {
  return from(this.pb.collection(collection).getFullList({
    filter: `${field} = "${value}"`,
    expand: ''
  }));
}

getRecordsWhereExpand(collection: string, field: string, value: string, expand: string = ''): Observable<any[]> {
  return from(this.pb.collection(collection).getFullList({
    filter: `${field} = "${value}"`,
    expand: expand
  }));
}
  private async init(collection: string) {
    const result = await this.pb.collection(collection).getFullList();
    this.dataSubjects[collection].next(result);

    this.pb.collection(collection).subscribe('*', (e) => {
      this.handleRealtime(collection, e);
    });
  }

  private handleRealtime(collection: string, event: any) {
    const current = this.dataSubjects[collection].value;
    const record = event.record;
    let updated: any[] = [];

    switch (event.action) {
      case 'create':
        updated = [...current, record];
        break;
      case 'update':
        updated = current.map(p => p.id === record.id ? record : p);
        break;
      case 'delete':
        updated = current.filter(p => p.id !== record.id);
        break;
    }

    this.dataSubjects[collection].next(updated);
  }

  deleteRecord(collection: string, id: any): Observable<any> {
    return from(this.pb.collection(collection).delete(id));
  }

  getRecord(collection: string, id: any): Observable<any> {
    return from(this.pb.collection(collection).getOne(id));
  }

  updateRecord(collection: string, id: any, data: any): Observable<any> {
    return from(this.pb.collection(collection).update(id, data));
  }

  createRecord(collection: string, data: any): Observable<any> {
    return from(this.pb.collection(collection).create(data));
  }

}
