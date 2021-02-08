import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-meus-pedidos-status',
  templateUrl: './meus-pedidos-status.component.html',
  styleUrls: ['./meus-pedidos-status.component.css']
})
export class MeusPedidosStatusComponent implements OnInit {
  @Input()
  rastreio: string = '-';
  @Input()
  estimativa: string = '-'
  constructor(public appsevice: AppService) { }
  @Input()
    public st: number;

    copy(c){
      navigator.clipboard.writeText(c).then(function() {
        alert('Codigo Copiado!')
        window.location.href='https://www2.correios.com.br/sistemas/rastreamento/';
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }
  ngOnInit(): void {
  }

}
