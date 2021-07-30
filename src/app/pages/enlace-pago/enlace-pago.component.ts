import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Cabecera } from '../../interfaces/interfaces';
import { AdamspayService } from '../../services/adamspay.service';
import { Router } from '@angular/router';
import { WebhookService } from '../../services/webhook.service';

@Component({
  selector: 'app-enlace-pago',
  templateUrl: './enlace-pago.component.html',
  styleUrls: ['./enlace-pago.component.css'],
})
export class EnlacePagoComponent implements OnInit {

  constructor(private storageService: StorageService,
              private adamspayService: AdamspayService,
              private router: Router,
              private webhook: WebhookService) {
    this.webhook.socket$
    .subscribe(resp => {
      console.log(JSON.parse(resp[0].split('/').join('')))
    });
  }

  pedidos: Cabecera ={}
  urlPago = 'Hola Mundo';

  async ngOnInit() {
    this.pedidos = this.storageService.obtenerPedido();
    await this.generarEnlacePago()
  }

  getTotalCost() {
    return this.pedidos.detalle?.map(t => t.subtotal).reduce((acc, value) => (acc || 0) + (value || 0), 0);
  }

  async generarEnlacePago() {

    const montoDeuda = this.getTotalCost()

    const resp: any = await this.adamspayService.crearDeuda(montoDeuda || 0);

    console.log('respuesta de generar pago', resp)

    if (resp === {}) {
      alert('Ocurrio un error, por favor vuelva a intentarlo');
      this.router.navigateByUrl('/confirmar')
    } else {
      this.urlPago = resp.debt.payUrl
    }
  } 

  pagar() {
    window.location.assign(this.urlPago);
  }

  cancelar() {
    this.router.navigateByUrl('/confirmar')
  }

/*   ngOnDestroy(): void {

    this.webhook.socket$.unsubscribe()
  }
 */
}
