import { Injectable } from '@angular/core';

import {webSocket} from 'rxjs/webSocket'


@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  
  public socket$ = webSocket<string[]>('wss://morning-falls-92647.herokuapp.com/')

  constructor() { 
  }
}