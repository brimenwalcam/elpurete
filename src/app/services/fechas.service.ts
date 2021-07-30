import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechasService {

  constructor() { }

  dosDigitos(nro: any) {
    if (nro < 10) {
      return  `0${nro}`
    } else {
      return `${nro}`
    }
  }

  fechaHoraUTC(dias?: number) {
    const utcValidez = new Date(new Date().getTime() + (86400000 * (dias || 0)))
    return  `${new Date(utcValidez).getFullYear()}-${this.dosDigitos(new Date(utcValidez).getMonth() + 1)}-${this.dosDigitos(new Date(utcValidez).getDate())}T${this.dosDigitos(new Date(utcValidez).getUTCHours())}:${this.dosDigitos(new Date(utcValidez).getUTCMinutes())}:${this.dosDigitos(new Date(utcValidez).getUTCSeconds())}+0000`
  }
}
