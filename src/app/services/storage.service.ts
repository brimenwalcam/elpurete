import { Injectable } from '@angular/core';
import { Cabecera } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  pedido: Cabecera = {}

  constructor() { }

  guardarPedido(ped: Cabecera) {
    localStorage.setItem('pedido', JSON.stringify(ped))
  }

  obtenerPedido(): Cabecera {
    return JSON.parse(localStorage.getItem('pedido') || '');
  }

  guardarIdDeuda(deuda: string) {
    localStorage.setItem('idDeuda', deuda);
  }

  obtenerIdDeuda() {
    return localStorage.getItem('idDeuda') || '';
  }

  borrarTodo() {
    localStorage.clear();
  }

  saveWebhookMessage(wh: any) {
    localStorage.setItem('webhook', wh);
  }
}
