export interface Cabecera {
    nombre?: string;
    ci?: string;
    fecha?: Date;
    detalle?: Detalle[];
}

export interface Detalle {
    producto?: string;
    cantidad?: number;
    precio?: number;
    subtotal?: number;
}

export interface Producto {
    id?: number;
    nombre?: string;
    precio?: number;
}

export interface Debt {
  docId: string;
  amount: Amount;
  label: string;
  validPeriod: ValidPeriod;
}

export interface ValidPeriod {
  start: string;
  end: string;
}

export interface Amount {
  currency: string;
  value: number;
}