import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Cabecera } from '../../interfaces/interfaces';
import { StorageService } from '../../services/storage.service';
import { AdamspayService } from '../../services/adamspay.service';
import { WebhookService } from 'src/app/services/webhook.service';

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent implements OnInit {

  pedido: Cabecera = {}
  idDeuda: string = ''
  hayDeuda = true
  urlPago = ''

  constructor(private storageService: StorageService,
              private router: Router,
              private adamsPayService: AdamspayService,
              private webhook: WebhookService) { 

    this.webhook.socket$
    .subscribe(resp => {
      console.log(JSON.parse(resp[0].split('/').join('')))
    });

  }

  ngOnInit(): void {
    this.pedido = this.storageService.obtenerPedido() || {};
    this.idDeuda = this.storageService.obtenerIdDeuda() || 'holamundo';
    this.existeDeuda(this.idDeuda)
  }

  getTotalCost() {
    return this.pedido.detalle?.map(t => t.subtotal).reduce((acc, value) => (acc || 0) + (value || 0), 0);
  }

  confirmar() {
    this.router.navigateByUrl('/enlace-pago')
  }

  verPago() {
    window.location.assign(this.urlPago);
  }

  async existeDeuda(idDeuda: string) {
    let resp = await this.adamsPayService.leerDeuda(idDeuda)
    console.log('existe deuda', JSON.stringify(resp))
    if (resp !== {}) {
      if (resp.status === "success") {
        if (resp.payStatus.status === 'paid') {
          this.hayDeuda = false
          this.urlPago = resp.payUrl
        } else {
          this.hayDeuda = true
        }
      } else {
        if (resp.reason === 'not_found') {
          this.hayDeuda = true
        }
      }
    } else {
      alert('Hubo un error, por favor vuelva a intentarlo');
      this.router.navigateByUrl('/')
    }
  }

  cancelar() {
    if (this.idDeuda !== 'holamundo' && this.hayDeuda === true) {
        this.adamsPayService.borrarDeuda(this.idDeuda)
    }
    this.storageService.borrarTodo()
    this.router.navigateByUrl('/')
  }

  cerrar() {

    this.storageService.borrarTodo()
    this.router.navigateByUrl('/')
  }

/*   ngOnDestroy(): void {

    this.webhook.socket$;
  } */
  
}
