import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmarComponent } from './pages/confirmar/confirmar.component';
import { EnlacePagoComponent } from './pages/enlace-pago/enlace-pago.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';


const routes: Routes = [
  {
    path: '',
    component: PedidosComponent
  },
  {
    path: 'enlace-pago',
    component: EnlacePagoComponent
  },
  {
    path: 'confirmar',
    component: ConfirmarComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
