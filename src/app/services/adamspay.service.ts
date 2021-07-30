import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Debt } from '../interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { FechasService } from './fechas.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdamspayService {

  siExiste = "update"
  path = "/api/v1/debts"
  notificarAlWebhook = "true"
  docId = uuidv4()
  
  inicioValidez = this.fechasService.fechaHoraUTC(0)

  finValidez =  this.fechasService.fechaHoraUTC(2)
  
  constructor(private http: HttpClient,
              private fechasService: FechasService,
              private storageService: StorageService) {
   }

  async leerDeuda(idDeuda: string) {

    const headers = new HttpHeaders({'apikey': environment.apiKey})

    try {
      let deuda: any = await this.http.get(`${environment.host}${this.path}/${idDeuda}`, {headers: headers}).toPromise();

      return {
        status: deuda.meta.status,
        payStatus: deuda.debt.payStatus,
        payUrl: deuda.debt.payUrl
      }
    } catch (error) {
      console.log('error leer deuda', error)
      if (!error.error.meta) {
        return {}
      } else {
        return {
          status: error.error.meta.status,
          reason: error.error.meta.reason
        }
      }
    }
  }

  async crearDeuda(monto: number) {

    console.log('monto', monto)
    
    const headers = new HttpHeaders({'apikey': environment.apiKey, 'Content-Type': 'application/json'})
    let idDeuda = uuidv4()

    this.storageService.guardarIdDeuda(idDeuda)

    let postJson: Debt = {
      docId: idDeuda,
      amount: {currency: 'PYG', value: monto},
      label: 'Compra de frutas/verduras',
      validPeriod: {start: this.inicioValidez, end: this.finValidez}
    }

    let post = {debt: postJson}

    console.log('apikey', environment.apiKey);
    console.log('post', post);

    try {
      return await this.http.post(`${environment.host}${this.path}`, post, {headers}).toPromise()
    } catch (error) {
      console.log('error: ', error)
      return {} 
    }
  }

  async borrarDeuda(id: string) {

    const headers = new HttpHeaders({'apikey': environment.apiKey/* , "x-should-notify": this.notificarAlWebhook */})

    try {
      console.log(JSON.stringify(await this.http.delete(`${environment.host}${this.path}/${id}`, {headers: headers}).toPromise()))
    } catch (error) {
      console.log('error', error);      
      
    }
  }
}
