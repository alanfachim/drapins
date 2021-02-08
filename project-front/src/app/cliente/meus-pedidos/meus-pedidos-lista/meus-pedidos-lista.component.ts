import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-meus-pedidos-lista',
  templateUrl: './meus-pedidos-lista.component.html',
  styleUrls: ['./meus-pedidos-lista.component.css']
})
export class MeusPedidosListaComponent implements OnInit {

  @Input()
  public lista: any[];

  deleta(i) {

  }
  constructor() { }

  ngOnInit(): void {
  }

}
