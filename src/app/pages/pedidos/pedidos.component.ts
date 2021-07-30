import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cabecera, Detalle } from 'src/app/interfaces/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {

  envio: Cabecera = {};
  pedidos: Detalle[] = [];
  productos = [
    {
      id: 1,
      nombre: 'Tomate',
      precio: 6000,
    },
    {
      id: 2,
      nombre: 'Cebolla',
      precio: 5000,
    },
    {
      id: 3,
      nombre: "Locote",
      precio: 6500,
    },
    {
      id: 4,
      nombre: 'Zanahoria',
      precio: 5500,
    },
    {
      id: 5,
      nombre: 'Naranja',
      precio: 6300,
    }
  ];

  pedidosForm = new FormGroup({
    producto: new FormControl('', [Validators.required]),
    cantidad: new FormControl(0),
    fecha: new FormControl((new Date().toISOString().split('T')[0])),
    nombre: new FormControl(''),
    ci: new FormControl(''),
    precio: new FormControl(0),
    subtotal: new FormControl(0)
  });

  constructor(private router: Router,
              private storageService: StorageService) {
    this.pedidosForm.controls['producto'].setValue(this.productos[0].nombre);
    this.precio(this.productos[0].nombre)
  }

  ngOnInit(): void {
    this.storageService.borrarTodo();
    this.reiniciarCabecera();
  }

  producto(ev: any) {
    alert(ev)
  }

  getSubTotal(): void {
    if (String(this.pedidosForm.value.cantidad).length > 4) {
      this.pedidosForm.value.cantidad = Number(String(this.pedidosForm.value.cantidad).slice( 0, 4));
      this.pedidosForm.controls['cantidad'].setValue(Number(String(this.pedidosForm.value.cantidad).slice( 0, 4)));
    }
    if (this.pedidosForm.value.cantidad < 0) {
      this.pedidosForm.value.cantidad = 0;
      this.pedidosForm.controls['cantidad'].setValue(0);
    }
    if (this.pedidosForm.value.precio !== '0') {
      this.pedidosForm.controls['subtotal'].setValue(Number(this.pedidosForm.value.cantidad) * Number(this.pedidosForm.value.precio));
    }
  }

  precio(pro: any) {
      let precio = this.productos.find(el => el.nombre === pro)?.precio;
      this.pedidosForm.controls['precio'].setValue(precio);
      this.getSubTotal();
  }

  agregar(): void {
    if (this.validar()) {
      if (this.productoRepetido() === false) {
        console.log(this.productoRepetido());
        this.pedidos.push({
          producto: this.pedidosForm.value.producto,
          precio: this.pedidosForm.value.precio,
          cantidad: this.pedidosForm.value.cantidad,
          subtotal: this.pedidosForm.value.subtotal});
      //  this.table.renderRows();
      }
      this.reiniciarForm();
    }
  }

  validar(): boolean {
    if (this.pedidosForm.value.producto === '') {
      alert("Seleccione un producto")
      return false;
    } else if (!this.pedidosForm.value.cantidad || this.pedidosForm.value.cantidad === '0' || this.pedidosForm.value.cantidad < 0 || this.pedidosForm.value.cantidad > 1000) {
      alert('Agregue una cantidad valida')
      return false;
    }
    return true;
  }
  
  productoRepetido(): boolean {
    let resp = false;
    this.pedidos.forEach(art => {
      if (art.producto === this.pedidosForm.value.producto) {
        art.cantidad += this.pedidosForm.value.cantidad;
        art.subtotal = (art.cantidad || 0) * (art.precio || 0);
        resp = true;
      //  this.table.renderRows();
      } else {
        resp = false;
      }
    });
    return resp;
  }

  reiniciarForm(): void {
    this.pedidosForm.controls['producto'].setValue(this.productos[0].nombre);
    this.pedidosForm.controls['cantidad'].setValue(0);
    this.pedidosForm.controls['subtotal'].setValue(0);
  }

  borrarFila(cod: number): void {
    this.pedidos.splice( cod, 1 );
  //  this.table.renderRows();
  }

  getTotalCost() {
    return this.pedidos.map(t => t.subtotal).reduce((acc, value) => (acc || 0) + (value || 0), 0);
  }

  realizarPedido(): void {
    if (this.pedidosForm.value.nombre === '') {
      alert('Complete el campo cliente');
    } else if (this.pedidosForm.value.ci === ''){
      alert('Complete el campo ci');
    } else if (new Date(this.pedidosForm.value.fechaPedido).getTime() <= new Date().getTime())  {
      alert('Agregue una fecha valida');
    } else {
      this.prepararPedido();
    }
  }
  
  prepararPedido() {
    this.envio = {
      nombre: this.pedidosForm.value.nombre,
      ci: this.pedidosForm.value.ci,
      fecha: this.pedidosForm.value.fecha,
      detalle: this.pedidos
    }
    this.storageService.guardarPedido(this.envio);
    this.router.navigateByUrl('/confirmar');
  }

  reiniciarCabecera() {
    this.reiniciarForm()
    this.pedidosForm.controls['nombre'].setValue('');
    this.pedidosForm.controls['ci'].setValue('');
  }

} 





